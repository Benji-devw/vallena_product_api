const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cors = require("cors"),
    helmet = require("helmet"),
    db = require("./db"),
    app = express(),
    apiPort = 8800,
    productRouter = require("./routes/productRouter"),
    commentRouter = require("./routes/commentRouter");

// Helmet
app.use(helmet());

// MongoDB Configuration
mongoose.Promise = global.Promise;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Body Parser
const urlencodedParser = bodyParser.urlencoded({
    extended: true,
});
app.use(urlencodedParser);
app.use(bodyParser.json());

// CORS (système de sécurité) || app.use(cors());
app.use(cors());

app.use("/public", express.static("public"));

// ROUTE
app.use("/api/shop", productRouter);
app.use("/api/comment", commentRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
