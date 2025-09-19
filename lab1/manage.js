import fs from "fs/promises";

const data = await fs.readFile("./users.json", "utf-8");

if (data) {
    var parsedData = JSON.parse(data);
} else {
    var parsedData = [];
}

const [, , action, ...params] = process.argv;

async function add(name) {
    if (!name) {
        console.log("wrong entries");
        return;
    }

    parsedData.push({ "id": (parsedData.length + 1), "name": name });
    await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
    console.log("The user has been added");
}

async function remove(id) {
    if (!id) {
        console.log("wrong entries");
        return;
    }

    let user = parsedData.find((user) => user.id === Number(id));
    if (user) {
        parsedData = parsedData.filter((user) => {
            return user.id !== Number(id);
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

function getOne(id) {
    if (!id) {
        console.log("wrong entries");
        return;
    }

    let user = parsedData.find((user) => user.id === Number(id));
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

async function edit(id, name) {
    if (!id || !name) {
        console.log("wrong entries");
        return;
    }
    let user = parsedData.find((user) => user.id === Number(id));
    if (user) {
        parsedData  = parsedData.map(user =>
            user.id === Number(id) ? { ...user, name: name } : user
        );
        await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
        console.log("The user has been updated");
    } else {
        console.log("The user doesn't exist");
    }
}

switch (action) {
    case "add":
        add(params[0]);
        break;

    case "remove":
        remove(params[0]);
        break;

    case "getone":
        getOne(params[0]);
        break;

    case "getall":
        getAll();
        break;

    case "edit":
        edit(params[0], params[1]);
        break;

    default:
        console.log("Invalid input");
        break;
}