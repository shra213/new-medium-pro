import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Bindings } from 'hono/types'
import { decode, verify, sign, jwt } from 'hono/jwt'


const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        jwtSecret: string
    }
    Variables: {
        prisma: any,
        userID: string
    }
}>();

type body = {
    title: string,
    content: string,
    authorID: string
}
blogRouter.use('*', async (c, next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    c.set('prisma', prisma);
    await next();
})

blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("Authorization");
    const token = header ? header.split(" ")[1] : undefined;
    console.log(token);

    if (!token) {
        return c.text("not verified");
    }
    try {
        const user = await verify(token, c.env.jwtSecret);
        console.log(user);
        console.log("sHRUTI");
        // @ts-ignore
        c.set('userID', user.id);
        console.log(c.get("userID"));

        await next(); // ✅ await this!
    } catch (err) {
        console.log("hii");
        return c.json({
            msg: "invalid token",
            hi: "ashdajh"
        })
    }
})

blogRouter.post('/', async (c) => {
    try {
        const body: body = await c.req.json();
        const { title, content } = body;
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());
        // const prisma = c.get("prisma");
        if (!c.get("userID")) {
            return c.json({ error: 'User not authenticated' }, 401)
        }

        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                author: {
                    connect: {
                        id: c.get("userID")
                    }
                }
            }
        })
        if (!post) {
            return c.text("post not created")
        }
        return c.json({
            post: post
        })
    } catch (err) {
        console.error();
        //@ts-ignore
        return c.text(err);
    }
})

blogRouter.put('/', async (c) => {
    // const prisma = c.get("prisma");
    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const updated = await prisma.post.update({
        where:{
            id: body.id
        },
        data:{
            title:body.title,
            content:body.content
        }
    })

    return c.json({
        msg:"updated",
        updated: updated
    })
})

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blog = await prisma.post.findFirst({
        where:{
            id:id
        }
    })

    console.log(blog);
    return c.json({
        blog: blog
    })
})

blogRouter.get('/bulk/all', async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({
        // where:{
        //     id: c.get("userID")
        // }
    })
    return c.json({
        msg:"hiii",
        posts:posts
    })
})
export default blogRouter;


// {
//     "email":"ac@gmail",
//     "password":"1223456"
// }


// {
//     "title":"asss",
//     "content":"ahsioayhdkas"
// }