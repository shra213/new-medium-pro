import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Bindings } from "hono/types";
import { decode, verify, sign, jwt } from "hono/jwt";
import { createPostInput } from "shraddha-common";
const blogRouter = new Hono<{
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
  title: string;
  content: string;
  authorID: string;
};
blogRouter.use("*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  c.set("prisma", prisma);
  console.log("prisma set up");
  await next();
});

blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("Authorization");
  const token = header ? header.split(" ")[1] : undefined;
  console.log(token);
  const prisma = c.get("prisma");
  // const prisma = new PrismaClient({
  //   datasourceUrl:c.env.DATABASE_URL,
  // }).$extends(withAccelerate());

  if (!token) {
    return c.text("not verified, sign in again");
  }
  try {
    const user = await verify(token, c.env.jwtSecret);
    console.log(user);
    const use = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!use) {
      c.status(400);
      c.text("user not exist");
    }
    // @ts-ignore
    c.set("userID", user.id);
    console.log(c.get("userID"));

    await next(); // ✅ await this!
  } catch (err) {
    console.log(err);
    c.status(401);
    return c.json({
      msg: "invalid token signin again",
      error: err,
    });
  }
});

blogRouter.put("/update", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userID = c.get("userID");
  const updated = await prisma.users.update({
    where: {
      id: userID,
    },
    data: {
      name: body.name,
    },
  });
  if (!updated) {
    c.status(404);
    return c.text("error");
  }
  return c.text("updated" + body.name);
});

blogRouter.post("/", async (c) => {
  try {
    const body: body = await c.req.json();
    const { title, content } = body;
    const suc = createPostInput.safeParse(body);
    if (!suc.success) {
      c.status(404);
      return c.text("invalid input");
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    // const prisma = c.get("prisma");
    if (!c.get("userID")) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: {
          connect: {
            id: c.get("userID"),
          },
        },
      },
    });
    if (!post) {
      throw c.text("post not created");
    }
    return c.json(
      {
        post: post,
      },
      201
    );
  } catch (err) {
    console.error();
    //@ts-ignore
    return c.json(
      { error: "Failed to create post. Please try again later." },
      500
    );
  }
});

blogRouter.put("/", async (c) => {
  // const prisma = c.get("prisma");
  const body = await c.req.json();
  const suc = createPostInput.safeParse(body);
  if (!suc.success) {
    return c.text("invalid input", 500);
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  if (!body.id) {
    return c.text("body not exist", 500);
  }
  try {
    // if (!body.id || typeof body.id !== "string" || body.id.length < 15) {
    //   return c.json({ error: "Invalid ID" }, 400);
    // }

    const updated = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        date: new Date(),
      },
    });
    console.log(updated);
    return c.json(
      {
        msg: "updated",
        updated: updated,
      },
      201
    );
  } catch (e) {
    console.log(e);
    return c.json(
      {
        msg: "error in upadating post ",
        err: e,
      },
      501
    );
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
        date: true,
      },
    });

    console.log(blog);
    return c.json({
      blog: blog,
    });
  } catch (e) {
    console.log("error in fetching post");
  }
});

blogRouter.get("/bulk/all", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      where: {
        Published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
        date: true,
      },
    });
    const sorted = posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    console.log(posts);
    return c.json(
      {
        posts: posts,
        sorted: sorted,
      },
      201
    );
  } catch (e) {
    console.log("error while fetching posts");
    return c.json(
      {
        msg: e,
      },
      501
    );
  }
});

blogRouter.delete("/delete/:id", async (c) => {
  const id = c.req.param("id");
  // const prisma = c.get("prisma");
  console.log(id);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const deleted = await prisma.post.delete({
      where: {
        id: id,
        authorId: c.get("userID"),
      },
    });
    return c.json({ message: "Deleted", post: deleted });
  } catch (err: any) {
    if (err.code === "P2025") {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json({ error: "Failed to delete" }, 500);
  }
});

blogRouter.get("/mine/allpost", async (c) => {
  const userID = c.get("userID");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const myPosts = await prisma.post.findMany({
      where: {
        authorId: userID,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
        date: true,
        Published: true,
      },
    });
    console.log(myPosts);
    const sorted = myPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return c.json({
      msg: "success",
      myPosts: myPosts,
    });
  } catch (e) {
    console.log("error while fetch mypost");
    return c.text("can not fetch yur post" + e);
  }
});

blogRouter.post("/publish", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    if (!body.id) {
      console.log(body.id);
      return c.text("invalid inputs", 500);
    }
    const post = await prisma.post.update({
      where: {
        //@ts-ignore
        id: body.id,
        Published: false,
      },
      data: {
        Published: true,
      },
    });
    console.log(post);
    return c.json(
      {
        msg: "published",
        post: post,
      },
      201
    );
  } catch (e) {
    console.log("erroe while publishing");
    return c.text("can not published" + e, 501);
  }
});

blogRouter.delete("/deleteAcc", async (c) => {
  const userID = c.get("userID");
  // const prisma = c.get("prisma");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userID,
      },
    });
    if (!user) {
      return c.text("user not exist", 501);
    }
    await prisma.post.deleteMany({
      where: {
        authorId: userID,
      },
    });
    const deleted = await prisma.users.delete({
      where: {
        id: userID,
      },
    });
    if (!deleted) {
      return c.text("unable to delete", 400);
    }
    return c.json({
      deleted,
    });
  } catch (e) {
    console.log(e);
    return c.json(
      {
        msg: "unable to delete",
        e,
      },
      400
    );
  }
});

blogRouter.get("/auth/me", async (c) => {
  const userID = c.get("userID");
  if (!userID) {
    return c.json(
      {
        msg: "user is not authenticated",
      },
      400
    );
  }
  return c.json({
    userID: userID,
  });
});

export default blogRouter;

// {
//     "email":"ac@gmail",
//     "password":"1223456"
// }

// {
//     "title":"asss",
//     "content":"ahsioayhdkas"
// }
