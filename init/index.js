const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://mdrafin008:jr976YawsNhrNZGk@cluster0.7gknfrz.mongodb.net/wanderlust ";


main().then(() =>{
      console.log("connected to DB");

}).catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({

    });

    await Listing.insertMany(initData.data);
    console.log("data was initialize");
}

initDB();