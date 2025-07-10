import type { Socket } from "net";
import { db } from "..";

export default {
  //decrement
  name: "decr",
  exec: (socket: Socket, args?: string[]) => {
    if (!args) return;
    if (args.length !== 1) {
      socket.write("-ERR wrong number of arguments for 'decr' command\r\n");
      socket.write("The Format Is decr key\r\n");
      return;
    }
    let value = Number(db.get(args[0] as string));
    if (Number.isNaN(value)) {
      socket.write("-ERR value is not an integer or out of range\r\n");
    }
    value--;
    db.set(args[0] as string, value.toString());
    socket.write(`:${value}\r\n`);
  },
};
