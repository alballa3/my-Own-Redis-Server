import { createServer, Socket } from "net";
import path from "path";
import fs from "fs";
interface command {
  name: string;
  exec: (socket: Socket, args?: string[]) => void;
}
const commands: command[] = [];
type RedisValue = string | string[]; // you can expand this later (e.g., number, hash, etc.)

export const db: Map<string, RedisValue> = new Map();

const commandsPath = path.join(process.cwd(), "commands");
console.log(commandsPath);
const commandsFolder = fs.readdirSync(commandsPath);
for (const Folder of commandsFolder) {
  const commandPath = path.join(commandsPath, Folder);
  const command = require(commandPath);
  commands.push(command.default);
}

const server = createServer((socket) => {
  socket.on("data", (data) => {
    const input = data.toString().trim().split(" ")[0]?.toLowerCase();
    const check = commands.find((command) => command.name === input);
    if (check) {
      const args = data.toString().trim().split(" ").slice(1);
      check.exec(socket, args);
    } else {
      socket.write("-ERR unknown command\r\n");
    }
  });
});

server.on("connection", () => {
  console.log("client connected");
});

server.listen(6379, () => {
  console.log("server is running");
});
