import { spawn } from "child_process";

export default async function spawnBuffered(command, args) {
  const proc = spawn(command, args, { stdio: "pipe" });

  const buffer = new Promise(resolve => {
    const buffers = [];
    proc.stdout
      .on("data", data => {
        buffers.push(data);
      })
      .on("end", () => resolve(Buffer.concat(buffers)));
  });

  const errBuffers = [];
  proc.stderr.on("data", data => {
    errBuffers.push(data);
  });

  await new Promise((resolve, reject) => {
    proc.on("error", reject);
    proc.on("exit", code => {
      if (code !== 0) {
        reject(
          new Error(
            `${command} exited with code ${code}:\n${Buffer.concat(
              errBuffers
            ).toString("utf8")}`
          )
        );
      } else {
        resolve();
      }
    });
  });

  return await buffer;
}
