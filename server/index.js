import Koa from "koa";
const app = new Koa();

app.use(async ctx => {
  ctx.body = "Hello word";
});

app.listen(3000);

console.log("Listening at port 3000");

export default app;
