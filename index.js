import express from "express";
import path from "path";
import { router } from "./routes/user.js";
import mongoose  from "mongoose";

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/Blogify")
.then(() => console.log("MongoDb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/user", router);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));