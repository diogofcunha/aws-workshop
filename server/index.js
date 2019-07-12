import Koa from "koa";
import cors from "@koa/cors";

import spawnBuffered from "./utils/spawnBuffered";

const app = new Koa();

app.use(cors()).use(async ctx => {
  const resultBuffer = await spawnBuffered("ffmpeg", ["-version"]);

  ctx.body = resultBuffer.toString();
});

app.listen(5000);

console.log("Listening at port 5000");

export default app;
