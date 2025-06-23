import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Bindings } from "hono/types";
import { decode, verify, sign, jwt } from "hono/jwt";
import { signupInput } from "shraddha-common";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    jwtSecret: string;
  };
  Variables: {
    prisma: any;
    userID: string;
  };
}>();

type body = {
  name: string;
  email: string;
  password: string;
};
userRouter.use("*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  c.set("prisma", prisma);
  await next();
});
userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  console.log(body.email);
  const suc = signupInput.safeParse(body);
  console.log(suc);
  if (!suc.success) {
    console.log("hfsidofj");
    return c.text("inputs are not validate");
  }
  console.log(body);
  const dbUrl = c.env.DATABASE_URL;
  const prisma = c.get("prisma");
  // Example of inserting a user
  const exist = await prisma.users.findUnique({
    where: {
      email: body.email,
    },
  });
  if (exist) {
    // console.log(exist);
    return c.json({
      msg: "user already exist",
      exist: exist,
    });
  }
  // const pass = createHash(password);
  const user = await prisma.users.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });

  const token = await sign({ id: user.id }, c.env.jwtSecret);

  return c.json({ message: "User created", user, jwt: token });
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const { email, password }: body = body;

  const suc = signupInput.safeParse(body);
  if (!suc.success) {
    return c.text("invalid inputs");
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // const prisma = c.get("prisma");
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  // console.log(user);

  if (!user) {
    c.status(403);
    return c.text("plz signup first");
  }
  if (user.password !== password) {
    return c.text("password is incorrect");
  }
  const token = await sign(
    {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // expires in 1 hour
    },
    c.env.jwtSecret
  );

  return c.json({
    jwt: token,
    user: user,
  });
});

export default userRouter;
