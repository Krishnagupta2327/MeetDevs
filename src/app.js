const express = require('express');
const app= express();

const {adminAuth, userAuth} = require("./middlewares/auth.js");
app.listen(7777, () => {
    console.log("Server is running succesfully on port 7777");

});

app.use("/school",userAuth, (req,res,next)=>{
    console.log("first middleware for /school");
    next();
    //res.send("Middleware response for /school");
}
);

app.use("/school/testing", (req,res,next)=>{
    console.log("Second middleware for /school");
    next();
    //res.send("Middleware response for /school");
}
);
app.use("/school/testing/r1", (req,res)=>{
    console.log("Second ppo middleware for /school");
    res.send("Middleware response for /school");
}
);
app.use("/school/exam", (req,res)=>{
    console.log("Second 9 middleware for /school");
    res.send("Middleware response 9 for /school");
}
);
app.use("/abc", (req,res, next) =>{
    res.send("hiii");
    console.log("Middleware for /abc");
    // res.send("Middleware response for /abc " + req.query.name);
    next();
},(req,res)=>{
    console.log("Second middleware for /abc");
    res.send("Middleware response for /abc " + req.query.name);
});
app.use("/abcd/:name/:age", (req,res, next) =>{
    if(req.params.age>14)console.log("Middleware for /abc");
    next();
},(req,res)=>{
    console.log("Second middleware for 24/abc");
    res.send("Middleware response for /abc " + req.params.name+req.params.age);
});

app.get(/abhb*c/,(req,res) =>{
    res.send({name: "krishna", Dept: "IT"})
});
app.use("/hello",(req,res)=>{
    res.send("hello");
});

app.use("/test", (req,res)=>{
    res.send("test");
});
app.use("/",(req,res) =>{
    res.send("he llo world");
});

//comments added
//new tasks