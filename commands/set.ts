import type { Socket } from "net";
import { db } from "..";

export default {
  name: "set",
  exec: (socket: Socket, args?: string[]) => {
    if (args?.length !== 2) {
      socket.write("-ERR wrong number of arguments for 'set' command\r\n");
      socket.write("The Format Is set key value\r\n");
      return;
    }
    if (db.has(args[0] as string)) {
      socket.write(`You Cant Set The Value ${args[0]} \r\n`);
      return;
    }
    db.set(args[0] as string, args[1] as string);
    socket.write("+OK\r\n");
  },
};
