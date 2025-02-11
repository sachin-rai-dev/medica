import mongoose from "mongoose";

let schema = new mongoose.Schema({
    name:String,
    email:String,
    book_appointment:[{name:String,gender:String,date:String,mobile:String,imgurl:String,deparetment:String,}]
})

export let App_User = mongoose.models.appuser || mongoose.model("appuser",schema);