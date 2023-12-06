const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/flash", require("./routes/flashRoutes"))

app.listen(port || 5000, () => {
    console.log("Listening on port " + process.env.PORT)
});

module.exports = app;