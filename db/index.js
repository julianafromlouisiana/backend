
// console.log("Hello World");
//Create a basic Express Server
//Creates Server and Routes
//Send request from index.js to api folder then api to various routers
//In backend file, indexDB.js write code ###
const express = require("express");
const app = express.Router();


const bodyParser = require("body-parser");
const userDB = require("./users");
const client = require("./client");
const wandRouter = require("./api/wands");
const { requireUser, requireAdmin } = require("../api/utils");
const PORT = process.env.PORT || 3000;//If not ran on a localhost company may have their own PORT
const { JWT_SECRET = "sgegegegebrsdbsrb" } = process.env;

try{
client.connect();
console.log("Connected to the Database client");
} catch (err) {
    console.log("Error connecting to the database:", err);
    throw err;
}
app.use(bodyParser.json());
app.use("/api", require("./api"));
app.use("api", wandRouter);

//Error handling middleware
app.use((error, req, res, next) => {
    console.log("SERVER ERROR:" , error);
    res.statusCode;
    if(res.statusCode < 400) res.status(500);
    res.send({ error: error.message, name: error.name });
});


//Sends to /api index.js to backend indexDB.js

app.listen(PORT, () => {
    console.log(`Server is alive on ${PORT}`);
});
