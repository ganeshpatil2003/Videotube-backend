import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function databaseConnection (){
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
       console.log("MongoDb connection Successful !! : ",connectionInstance.connection.host);
    }catch(error){
        console.log("MongoDb connection failed :",error);
        process.exit(1);
    }
}

export {databaseConnection}