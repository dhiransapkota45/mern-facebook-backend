const mongoose = require("mongoose")

const connection = () => {
    try {
         mongoose.connect(process.env.
            DATABASE_URL, ()=>{
            console.log("connected to the database");
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = connection