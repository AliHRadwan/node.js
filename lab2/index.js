import { Command } from "commander";
import fs from "fs/promises";

const program = new Command();

const data = await fs.readFile("./users.json", "utf-8");

if (data) {
    var parsedData = JSON.parse(data);
} else {
    var parsedData = [];
}

async function add(options) {
    if (!options.n) {
        console.log("wrong entries");
        return;
    }

    parsedData.push({ "id": (parsedData.length + 1), "name": options.n });
    await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
    console.log("The user has been added");
}

async function remove(options) {
    if (!options.i) {
        console.log("wrong entries");
        return;
    }

    let user = parsedData.find((user) => user.id === Number(options.i));
    if (user) {
        parsedData = parsedData.filter((user) => {
            return user.id !== Number(options.i);
        });
        let counter = 0;
        parsedData = parsedData.map((user) => {
            user.id = ++counter;
            return user;
        });
        await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
        console.log("The user has been removed");
    } else {
        console.log("The user doesn't exist");
    }
}

function getOne(options) {
    if (!options.i) {
        console.log("wrong entries");
        return;
    }

    let user = parsedData.find((user) => user.id === Number(options.i));
    if (user) {
        console.log("User name: " + user.name + ", user id: " + user.id);
    } else {
        console.log("The user doesn't exist");
    }
}

function getAll() {
    if (parsedData.length !== 0) {
        parsedData.forEach((user) => {
            console.log("User name: " + user.name + ", user id: " + user.id);
        });
    } else {
        console.log("there are no users");
    }
}

async function edit(options) {
    if (!options.i || !options.n) {
        console.log("wrong entries");
        return;
    }
    let user = parsedData.find((user) => user.id === Number(options.i));
    if (user) {
        parsedData  = parsedData.map(user =>
            user.id === Number(options.i) ? { ...user, name: options.n } : user
        );
        await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
        console.log("The user has been updated");
    } else {
        console.log("The user doesn't exist");
    }
}

program
  .name('user management system by Ali H. Radwan')
  .description('CLI program to perform CRUD operations on a set of users')
  .version('1.0.0');

program
  .command("add")
  .description("To add a new user")
  .option("-n <name>", "add a new user by his name")
  .action(add);

program
  .command("remove")
  .description("To remove a user")
  .option("-i <id>", "remove a user by his id")
  .action(remove);
  
program
  .command("getone")
  .description("To get a user info")
  .option("-i <id>", "get a user info by his id")
  .action(getOne);

program
  .command("getall")
  .description("To get info of all users")
  .action(getAll);

program
  .command("edit")
  .description("To edit a user info")
  .option("-i <id>", "user id")
  .option("-n <name>", "user name")
  .action(edit);

program.parse();