import type { Socket } from "net";
import { expire } from "..";

export default {
  name: "expire",
  exec: (socket: Socket, args: string[]) => {
    if (!args || args.length < 2) {
      socket.write("-ERR wrong number of arguments for 'expire'\r\n");
      return;
    }
    const [key, timeStr] = args;
    const time = parseInt(timeStr as string);
    if (isNaN(time)) {
      socket.write("-ERR value is not an integer or out of range\r\n");
      return;
    }
    expire.set(key as string, Date.now() + time * 60);

    socket.write("+OK\r\n");
  },
};
