import type { Socket } from "net";
import { db } from "..";

export default {
  name: "lpush",
  exec: (socket: Socket, args?: string[]) => {
    if (!args) return;
    if (args.length < 2) {
      socket.write("-ERR wrong number of arguments for 'lpush' command\r\n");
      return;
    }
    const key = args[0] as string;
    const value = args.slice(1);
    const existingData = db.get(key) || [];
    const data = [...value, ...existingData];
    db.set(key, data);
    console.log(db.get(key));
    socket.write(`:${value.length}\r\n`);
  },
};
