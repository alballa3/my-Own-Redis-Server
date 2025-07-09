import type { Socket } from "net";

export default {
  name: "echo",
  exec: (socket: Socket, args?: string[]) => {
    socket.write(`+${args?.join(" ")}\r\n`);
  },
};
