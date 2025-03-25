import express from "express";
import bodyParser from "body-parser";
import {v4 as uuidv4} from "uuid";
import path from "path";
import { fileURLToPath } from "url";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase, ref, set, onValue, child, get, remove  } from "firebase/database";
import { title } from "process";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDmCS0xH4xDCQuVXzs8MIut1HbxBAjJ23Q",
    databaseURL: "https://storageblog-8e926-default-rtdb.europe-west1.firebasedatabase.app",
    authDomain: "storageblog-8e926.firebaseapp.com",
    projectId: "storageblog-8e926",
    storageBucket: "storageblog-8e926.firebasestorage.app",
    messagingSenderId: "203630211611",
    appId: "1:203630211611:web:3f289a5cefe1eb850cfebe",
    measurementId: "G-TPMHRM4FPL"
};
  
  // Initialize Firebase
  const fireBaseapp = initializeApp(firebaseConfig);
  const database = getDatabase(fireBaseapp);

// let posts = [];


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {

    const postListRef = ref(database, 'blogPosts/');

    get(postListRef).then((snapshot) => {
        if (snapshot.exists()) {
            const dataList = Object.values(snapshot.val()); // Convert object to list
            console.log(dataList); // Array of post objects
            res.render("indexList.ejs", { dataList });
        } else {
            res.render("index.ejs");  
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

//     const displayBlog = ref(database, 'blogPosts/');
//     onValue(displayBlog, (snapshot) => {
//     initdata = snapshot.val();

//     if (initdata === null) {
//         res.render("index.ejs");  

//      }else{
//         res.render("indexList.ejs", {initdata});
//         console.log(initdata.content);
//      }
//    });
    
});

app.post("/submit", (req, res) => {

    const randomVar = uuidv4();

    // posts.push({randomId: randomVar, title: req.body["postTitle"], content: req.body["postContent"]});
    
    set(ref(database, 'blogPosts/' + randomVar), {
        contentID: randomVar,
        title: req.body["postTitle"],
        content: req.body["postContent"]
    });

    const postListRef = ref(database, 'blogPosts/');

    get(postListRef).then((snapshot) => {

    const dataList = Object.values(snapshot.val());
      res.render("indexList.ejs", { randomId: randomVar, title: req.body["postTitle"], content: req.body["postContent"], dataList });
    }).catch((error) => {
        console.error(error);
    }); 
});

app.post("/blog", (req, res) => {

    const postId = req.body["postId"];
    let data = "";

    const displayBlog = ref(database, 'blogPosts/' + postId);
    onValue(displayBlog, (snapshot) => {
    data = snapshot.val();
    //   updateStarCount(postElement, data);
    console.log(data.content, data.title);
    res.render("blogpost.ejs", { blogId:postId, blogtitle: data.title, blogcontent: data.content});
    });

    // const post = posts.find(p => p.randomId === postId);
    // if (post) {
    //     res.render("blogpost.ejs", { blogId:postId, blogtitle: post.title, blogcontent: post.content});
    // } else {
    //     res.send("404 Error Not Found"); 
    // }
    // console.log(`${post, postId}`);
});

app.post("/delete", (req, res) => {
    const postId = req.body["postId"];
    // let deleteData = "";
    const getPostDlt = ref(database, 'blogPosts/' + postId);
    
    remove(getPostDlt)
      .then(() => {
        const newValueAfterDlt = ref(database, 'blogPosts/');
        onValue(newValueAfterDlt, (snapshot) => {
            if (snapshot.exists()) {
                const dataList = Object.values(snapshot.val()); // Convert object to list
                console.log(dataList); // Array of post objects
                res.render("indexList.ejs", { dataList });
            } else {
                res.render("index.ejs");  
            }
         });
        
     }).catch((error) => {
       console.error("Error deleting node:", error);
     });

    //  const getPostDlt = ref(database, 'blogPosts/' + postId);
    // onValue(getPostDlt, (snapshot) => {
    // deleteData = snapshot.val();
    // console.log(deleteData);
    // return remove(getPostDlt);
    // });

    // const afterDel = ref(database, 'blogPosts/');
    // get(afterDel).then((snapshot) => {
    //      if (snapshot.exists()) {
    //         const dataList = Object.values(snapshot.val()); // Convert object to list
    //         console.log(dataList); // Array of post objects
    //         res.render("indexList.ejs", { dataList });
    //      } else {
    //         res.render("index.ejs");  
    //         console.log("No data available");
    //      }
    // }).catch((error) => {
    //         console.error(error);
    // });


    // res.render("index.ejs", {posts: posts });

    // const post = posts.findIndex(p => p.randomId === postId);
    // if (post !== -1) {

    //     posts.splice(post, 1);

    //     console.log(postId);
    //     console.log(posts);
    //     console.log(post);
      
    //     res.render("index.ejs", {posts: posts });
    // }else{
    //     console.log("Post not found");
    // }

});

app.post("/edit", (req, res)=>{

 const editID = req.body["idEdit"]; 
 const postIndex = posts.findIndex(p => p.randomId === editID);


 if(postIndex !== -1){
    posts[postIndex].content = req.body["editContent"];

    res.render("blogpost.ejs", { blogId: editID, blogtitle: posts[postIndex].title, blogcontent: posts[postIndex].content});
    
    console.log(editID, posts[postIndex].title, posts[postIndex].content);
 }
 else{
    console.log("Post not found");
 }
});

// export const handler = serverless(app);
export default app;