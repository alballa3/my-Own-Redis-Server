import type { Socket } from "net";
import { db } from "..";

export default {
  name: "lrange",
  exec: (socket: Socket, args: string[]) => {
    if (!args) return;
    if (args.length < 2) {
      socket.write("-ERR wrong number of arguments for 'lrange' command\r\n");
      return;
    }
    const key = args[0]?.toLowerCase() ?? "";
    const start = parseInt(args[1] ?? "0");
    const data = db.get(key) as string[];
    const end = parseInt(args[2] ?? data.length.toString());
    const result = data.slice(start, end);
    socket.write(`*${result.length}\r\n`);
    result.forEach((item) => {
      socket.write(`$${item.length}\r\n${item}\r\n`);
    });
  },
};
