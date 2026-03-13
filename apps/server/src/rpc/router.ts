import { appContract } from "@MAPLE-GLOBAL/api-client/contract";
import { implement } from "@orpc/server";

const rpc = implement(appContract);

export const rpcRouter = rpc.router({
  health: rpc.health.handler(() => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  })),
  hello: rpc.hello.handler(({ input }) => ({
    message: `Hello, ${input.name}!`,
  })),
});
