const validator =require("validator");
const validateUser = (req)=>{
    const {firstName, lastName, age, email,password, contactNo} = req.body;
    if(!firstName){
        throw new Error("First name is requires!!");
    }
    if(!email){
        throw new Error("Email is required!!");
    }
    if(firstName.length <4 || firstName.length >20){
        throw new Error("first name should be between 4-20");

    }
    if(!validator.isEmail(email)){
        throw new Error("Email is invalid!!");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not secure!!");
    }
}
module .exports = {validateUser};