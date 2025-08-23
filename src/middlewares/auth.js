const adminAuth= (req,res,next)=>{
    const token = req.query.token;
    if(token != "xyz"){
        res.status(401).send("Invalid Admin!!");
    }
    else{
        next();
    }
};
const userAuth= (req,res,next)=>{
    const token= req.query.token;
    if(token!="abc"){
        res.status(401).send("Invalid User!!");
    }
    else{
        next();
    }
};

module.exports={
    adminAuth,
    userAuth
}