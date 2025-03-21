import express from "express";
import bodyParser from "body-parser";
import {v4 as uuidv4} from "uuid";
import path from "path";
import { fileURLToPath } from "url";
// import session from "express-session";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const router = express.Router();

let posts = [];
// const randomSession = uuidv4();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configure session middleware
// app.use(
//     session({
//       secret: randomSession, // Replace with a strong secret key
//       resave: false,
//       saveUninitialized: true,
//       cookie: { secure: false }, // Set secure: true if using HTTPS
//     })
//   );

// Middleware to initialize blogs storage for each session
// app.use((req, res, next) => {
//     if (!req.session.blogs) {
//       req.session.blogs = []; // Initialize blogs array for the session
//     }
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.req = req;
//     next();
//   });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "Public")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.render("index.ejs", { req });
    // res.send("Welcome to Anya Blog");
});

app.post("/submit", (req, res) => {

    // const randomVar = Math.floor(Math.random() * (40 - 12 + 1)) + 12; 
    const randomVar = uuidv4();

    posts.push({randomId: randomVar, title: req.body["postTitle"], content: req.body["postContent"]});

    // req.session.blogs.push({randomId: randomVar, title: req.body["postTitle"], content: req.body["postContent"]});

    res.render("index.ejs", { randomId: randomVar, title: req.body["postTitle"], content: req.body["postContent"], posts: posts });
});

app.post("/blog", (req, res) => {

    const postId = req.body["postId"];
    const post = posts.find(p => p.randomId === postId);
    // const post = req.session.blogs.find(p => p.randomId === postId);

    if (post) {
        res.render("blogpost.ejs", { blogId:postId, blogtitle: post.title, blogcontent: post.content});
    } else {
        res.send("404 Error Not Found"); 
    }
    console.log(`${post, postId}`);
});

app.post("/delete", (req, res) => {
    const postId = req.body["postId"];
    const post = posts.findIndex(p => p.randomId === postId);
    // const post = req.session.blogs.findIndex(p => p.randomId === postId);
    if (post !== -1) {

        posts.splice(post, 1);
        // req.session.blogs.splice(post, 1);

        console.log(postId);
        console.log(posts);
        console.log(post);
      
        res.render("index.ejs", {posts: posts });
    }else{
        console.log("Post not found");
    }

});

app.post("/edit", (req, res)=>{

 const editID = req.body["idEdit"]; 
 const postIndex = posts.findIndex(p => p.randomId === editID);
// const postIndex = req.session.blogs.findIndex(p => p.randomId === editID);

 if(postIndex !== -1){
    posts[postIndex].content = req.body["editContent"];

    res.render("blogpost.ejs", { blogId: editID, blogtitle: posts[postIndex].title, blogcontent: posts[postIndex].content});
    // res.render("blogpost.ejs", { blogId: editID, blogtitle: req.session.blogs[postIndex].title, blogcontent: req.session.blogs[postIndex].content});

    console.log(editID, posts[postIndex].title, posts[postIndex].content);
 }
 else{
    console.log("Post not found");
 }
});

// export const handler = serverless(app);
export default app;