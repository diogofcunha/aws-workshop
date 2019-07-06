import Koa from "koa";
const app = new Koa();

app.use(async ctx => {
  ctx.body = "Hello world";
});

app.listen(5000);

console.log("Listening at port 5000");

export default app;
