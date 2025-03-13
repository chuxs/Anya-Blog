import express from "express";
import bodyParser from "body-parser";
import {v4 as uuidv4} from "uuid";

const app = express();
const port = process.env.PORT || 3000;;
// const router = express.Router();

let posts = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.static("Public"));

app.get("/", (req, res) => {
    // res.render("index.ejs");
    console.log("Home Page");
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
