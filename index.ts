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
export const expire: Map<string, number> = new Map(); // key: key, value: expire time in unix timestamp
// export let expire_time = 4000; // 1 Sec default value
const DB_FILE = path.join(process.cwd(), "db.json");

const commandsPath = path.join(process.cwd(), "commands");
const commandsFolder = fs.readdirSync(commandsPath);
for (const Folder of commandsFolder) {
  const commandPath = path.join(commandsPath, Folder);
  const command = require(commandPath);
  commands.push(command.default);
}
setInterval(() => {
  if (db.size == 0) return;
  const obj = Object.fromEntries(db);
  const jsonString = JSON.stringify(obj);
  fs.writeFileSync(DB_FILE, jsonString);
  for(const key of expire.keys()){
    const expireTime = expire.get(key);
    if (expireTime && expireTime < Date.now()) {
      db.delete(key);
      expire.delete(key);
    }
  }
}, 1000);
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
  try {
    const data = fs.readFileSync(DB_FILE);
    const jsonString = data.toString();
    const obj = JSON.parse(jsonString);
    for (const key in obj) {
      db.set(key, obj[key]);
    }
  } catch (error) {
    console.log(error);
  }
  console.log("server is running");
});
