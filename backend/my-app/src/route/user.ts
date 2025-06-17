import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Bindings } from 'hono/types'
import {decode,verify,sign, jwt} from 'hono/jwt'
import {signupInput} from 'shraddha-common'
const userRouter = new Hono<{
    Bindings:{
    DATABASE_URL: string
    jwtSecret : string
  }
  Variables:{
    prisma: any,
    userID: string
  }
}>();

type body = {
  email : string,
  password : string
}
userRouter.use('*', async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL
  }).$extends(withAccelerate());

  c.set('prisma', prisma)
  await next();
})
userRouter.post('/signup', async (c) => {
  const body = await c.req.json()
  console.log(body.email);
  const suc = signupInput.safeParse(body);
  console.log(suc);
  if(!suc.success){
    console.log("hfsidofj");
    return c.text("inputs are not validate");
  }
  console.log(body);
  const dbUrl = c.env.DATABASE_URL
  // Use Accelerate-enabled PrismaClient
  // const prisma = new PrismaClient({
  //   datasourceUrl: c.env.DATABASE_URL,
  // }).$extends(withAccelerate())

  const prisma =c.get("prisma");
  // Example of inserting a user
  const exist = await prisma.users.findFirst({
    where:{
      email : body.email
    }
  })
  if(exist){
    // console.log(exist);
    return c.json({
      msg:"user already exist",
      exist :exist
    });
  }
  // const pass = createHash(password);
  const user = await prisma.users.create({
    data: {
      email:body.email,
      password:body.password,
    },
  })

  const token = await sign({id : user.id}, c.env.jwtSecret);

  return c.json({ message: 'User created', user,
    jwt : token
   })
})

userRouter.post('/signin', async (c)=>{
  const body = await c.req.json();
  const {email, password} : body = body;
  
  // const prisma = new PrismaClient({
  //   datasourceUrl: c.env.DATABASE_URL
  // }).$extends(withAccelerate());

  const prisma = c.get("prisma");
  const user = await prisma.users.findFirst({
    where:{
      email: email,
      password:password
    }
  })
  if(!user){
    console.log(user);
    c.status(403);
    return c.text("plz signup first");
  }
  const token = await sign({id: user.id}, c.env.jwtSecret);
  return c.json({
    jwt : token,
    user : user
  })
})

export default userRouter;