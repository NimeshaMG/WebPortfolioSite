const { mongo } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/localhost:3000/LoginSignUp")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connect");

})

const LoginScreama=new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("collection",LoginScreama)
module.exports=collection