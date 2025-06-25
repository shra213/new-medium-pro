import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Bindings } from "hono/types";
import { decode, verify, sign, jwt } from "hono/jwt";
import { createHash } from "hono/utils/crypto";
import userRouter from "./route/user";
import blogRouter from "./route/blog";
// import mailRoute from "./route/mail";

import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    jwtSecret: string;
  };
  Variables: {
    prisma: any;
  };
}>();

app.use("/*", cors());
// app.route("/api", mailRoute);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
