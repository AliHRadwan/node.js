const mysql = require("mysql2/promise");

const query = async (query, params = []) => {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "node_api",
            password: "ali@22"
        });

        const [results, fields] = await connection.execute(query, params);
        return results;

    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    query,
};