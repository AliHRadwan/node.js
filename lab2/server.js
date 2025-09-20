import http from "http";
import fs from "fs/promises";
import { content } from "./main.js";

const PORT = 3000;

const cssContent = await fs.readFile("./styles.css", "utf-8");
const users = await fs.readFile("./users.json", "utf-8");
if (users) {
  var parsedUsers = JSON.parse(users);
} else {
  var parsedUsers = [];
}

const server = http.createServer((req, res) => {
  console.log(req.url);
  const reg = new RegExp(/^\/users\/\d+$/);
  switch (req.method) {
    case "GET":
      switch (req.url) {
        case "/":
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content("Ali"));
          break;

        case "/styles.css":
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(cssContent);
          break;

        case "/users":
          res.writeHead(200, { "content-type": "application/json" });
          res.end(users);
          break;

        default:
          if (reg.test(req.url)) {
            const id = req.url.split('/')[2];
            const user = parsedUsers.find(u => u.id === parseInt(id))
            if (!user) {
              res.writeHead(404, { "content-type": "text/plain" })
              res.end("NOT FOUND");
              break;
            }

            res.writeHead(200, { "content-type": "application/json" })
            res.end(JSON.stringify(user));
            break;
          }

          res.writeHead(404);
          res.end(`<h1 style="color: red; margin: 20px;">Error!</h1>`);
          break;
      }
      break;
    case "POST":
      switch (req.url) {
        case "/users":
          let body = [];
          req
            .on("data", (chunk) => {
              body.push(chunk);
            })
            .on("end", async () => {
              try {
                body = Buffer.concat(body).toString();
                const user = JSON.parse(body);
                user.id = parsedUsers.length + 1;
                parsedUsers.push(user);
                await fs.writeFile(
                  "./users.json",
                  JSON.stringify(parsedUsers, null, 2)
                );
                res.writeHead(201, { "content-type": "application/json" });
                res.end(JSON.stringify({ 'success': true }));
              } catch (error) {
                res.writeHead(400);
                res.end("error");
              }
            });
          break;

        default:
          res.writeHead(400);
          res.end("error");
          break;
      }
      break;

    case "DELETE":
      switch (req.url) {
        case "/users":
          let body = [];
          req
            .on("data", (chunk) => {
              body.push(chunk);
            })
            .on("end", async () => {
              try {
                body = Buffer.concat(body).toString();
                const data = JSON.parse(body);
                let user = parsedUsers.find((user) => user.id === Number(data.id));
                if (!user) {
                  res.writeHead(404, { "content-type": "text/plain" })
                  res.end("NOT FOUND");
                  return;
                }

                parsedUsers = parsedUsers.filter((user) => {
                  return user.id !== Number(data.id);
                });
                
                let counter = 0;
                parsedUsers = parsedUsers.map((user) => {
                  user.id = ++counter;
                  return user;
                });

                await fs.writeFile("./users.json", JSON.stringify(parsedUsers, null, 2));
                res.writeHead(201, { "content-type": "application/json" });
                res.end(JSON.stringify({ 'success': true }));

              } catch (error) {
                res.writeHead(400);
                res.end("error");
              }
            });
          break;

        default:
          res.writeHead(404);
          res.end(`<h1 style="color: red; margin: 20px;">Error!</h1>`);
          break;
      }
      break;

    default:
      res.writeHead(404);
      res.end("invalid method");
      break;
  }
});

server.listen(PORT, "localhost", () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
