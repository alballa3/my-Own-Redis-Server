import type { Socket } from "net";

export default {
  name: "ping",
  exec: (socket: Socket) => {
    socket.write("+PONG\r\n");
  },
};
