import { createServer, Socket } from "net";
import path from "path";
import fs from "fs";
interface command {
  name: string;
  exec: (socket: Socket) => void;
}
const commands: command[] = [];

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
    console.log(data.toString());
    const input = data.toString().trim().toLowerCase();
    const check = commands.find((command) => command.name === input);
    console.log(check);
    if (check) {
      check.exec(socket);
    } else {
      socket.write("-ERR unknown command\r\n");
    }
  });
});

server.on("connection", (socket) => {
  console.log("client connected");
});

server.listen(6379, () => {
  console.log("server is running");
});
