import { databaseConnection } from "./db/index.js";

databaseConnection()















// (async() => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         console.log("connection successful !!! : ",connectionInstance.connection.host)
//     }catch(err){
//         console.error("ERROR : ",err);
//         process.exit(1);
//     }
// })()