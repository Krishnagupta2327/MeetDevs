const express = require('express');
const app= express();

app.listen(7777, () => {
    console.log("Server is running succesfully on port 7777");

});

app.get("/test", (req,res)=>{
    res.send("test");
});
app.get('/',(req,res) =>{
    res.send("hello world");
});
