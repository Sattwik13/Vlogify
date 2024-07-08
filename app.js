import express from "express";
import path from "path";
import  userRoute  from "./routes/user.js";
import  blogRoute  from "./routes/blog.js";
import mongoose  from "mongoose";
import cookieParser from "cookie-parser";
import { checkForAuthenticationCookie } from './middlewares/auth.js';
import  Blog  from "./models/blog.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

const app = express();
const PORT = process.env.PORT || 8002;

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public'))); // for render picture set  express.static

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));