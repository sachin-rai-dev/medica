import mongoose from "mongoose"

export async function conect() {
    try {

        let conection = mongoose.connection.readyState

        if (conection == 1) {
            return
        }

        if (conection == 2) {
            return
        }
        console.log("conect yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
        await mongoose.connect(`${process.env.MONGODB_CONCTION_URI_FOR_CONACTING_DB}`)
        console.log("conect yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    } catch (err) {
        console.log(err)
    }
}