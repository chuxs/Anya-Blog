import express from "express";
import bodyParser from "body-parser";
import {v4 as uuidv4} from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const router = express.Router();

let posts = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "Public")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.render("index.ejs");
    // res.send("Welcome to Anya Blog");
});

app.post("/submit", (req, res) => {

    // const randomVar = Math.floor(Math.random() * (40 - 12 + 1)) + 12; 
    const randomVar = uuidv4();

    posts.push({randomId: randomVar, title: req.body["postTitle"], content: req.body["postContent"]});

    res.render("index.ejs", { randomId: randomVar, title: req.body["postTitle"], content: req.body["postContent"], posts: posts });
});

app.post("/blog", (req, res) => {
    // const postId = parseInt(req.body["postId"],10);
    const postId = req.body["postId"];
    const post = posts.find(p => p.randomId === postId);
    if (post) {
        res.render("blogpost.ejs", { blogtitle: post.title, blogcontent: post.content});
    } else {
        res.send("404 Not Found"); 
    }
    console.log(`${post, postId}`);
});

// export const handler = serverless(app);
export default app;