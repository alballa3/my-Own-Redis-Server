import type { Socket } from "net";
import { db } from "..";

export default {
  name: "incr",
  exec: (socket: Socket, args?: string[]) => {
    if (!args) return;
    if (args.length !== 1) {
      socket.write("-ERR wrong number of arguments for 'incr' command\r\n");
      socket.write("The Format Is incr key\r\n");
      return;
    }
    const currentValue = db.get(args[0] as string);
    let value = currentValue === undefined ? 0 : Number(currentValue);
    if (Number.isNaN(value)) {
      socket.write("-ERR value is not an integer or out of range\r\n");
      return;
    }
    value++;
    db.set(args[0] as string, value.toString());
    socket.write(`:${value}\r\n`);
  },
};
