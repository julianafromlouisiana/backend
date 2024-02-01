const express = require ("express");
const app = express();
const client = require ("./db/client");
const PORT = process.env.PORT || 8080;

client.connect();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use("/api", require("./api"))
app.get("/", (req, res) => {
    res.send("Test successful");
})
app.listen(PORT, () => {
    console.log("Server is runnin");
})


