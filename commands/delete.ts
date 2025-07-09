import type { Socket } from "net";
import { db } from "..";

export default {
  name: "delete",
  exec: (socket: Socket, args?: string[]) => {
    if (!args || args?.length < 1) {
      socket.write("-ERR wrong number of arguments for 'delete' command\r\n");
      socket.write("The Format Is del key [key ...]\r\n");
      return;
    }
    let deletedCount = 0;
    for (let key of args) {
      if (db.has(key)) {
        db.delete(key);
        deletedCount++;
      }
    }
    socket.write(`:${deletedCount}\r\n`);     
    }
  
};
