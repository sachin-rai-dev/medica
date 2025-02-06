import * as mongoose from "mongoose"


let userSchema =new mongoose.Schema({
    username:String,
    userid:String,
    useremail:String,
    hospitalname:String,
    hospitalnameImgurl:String,
    add:String,
    subcreption:{type:String,default:"free"},
    expiredate:String,
    reviw:[{name:String,text:String,imgurl:String}],
    departments:[String],
    transitions:[String],
    appointments:[{name:String,gender:String,date:String,mobile:String,imgurl:String,deparetment:String,status:{type:String,default:"pending"}}],
    pissants: [{name:String,gender:String,mobile:String,imgurl:String,deparetment:String,date:String}],
    rating:{type:Number,default:0},
    subcreptionID:String,
    customerID:String,
    date:String
})

export const User = mongoose.models.user|| mongoose.model("user",userSchema)