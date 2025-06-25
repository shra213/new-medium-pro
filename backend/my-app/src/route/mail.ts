// import { Hono } from "hono";
// import { Resend } from "resend";

// const mailRoute = new Hono<{
//   Bindings: {
//     APP_PASS: string;
//   };
//   Variables: {
//     prisma: any;
//     userID: string;
//   };
// }>();

// mailRoute.post("/send-otp", async (c) => {
  // const body = await c.req.json();
  // console.log(body);
  // const resend = new Resend(`${c.env.APP_PASS}`);
  // console.log(c.env.APP_PASS);
  // try {
  //   const res = await resend.emails.send({
  //     from: "onboarding@resend.dev",
  //     to: body.email,
  //     subject: "Verify your email",
  //     html: `<h1>Your OTP is: ${body.otp}</h1>`,
  //   });

  //   console.log(res.error);
  //   return c.json({ success: true, body: body, msg: "hii in the send mail" });
  // } catch (err) {
  //   //@ts-ignore
  //   return c.json({ success: false, error: err.message });
  // }
// });

// export default mailRoute;
