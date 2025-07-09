import type { Socket } from "net";
import { db } from "..";

export default {
  name: "get",
  exec: (socket: Socket, args?: string[]) => {
    if (!args || args.length !== 1) {
      socket.write("-ERR wrong number of arguments for 'get' command\r\n");
      socket.write("The Format Is get key\r\n");
      return;
    }

    const value = db.get(args[0] as string);

    if (value === undefined) {
      socket.write("$-1\r\n");
    } else {
      socket.write(`$${value.length}\r\n${value}\r\n`);
    }
  },
};
