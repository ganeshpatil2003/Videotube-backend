import { databaseConnection } from "./db/index.js";

databaseConnection()
.then(
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is listening on port ${process.env.PORT || 8000}`);
    })
)
.catch((error) => {
    console.log("Database connection error");
})















// (async() => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         console.log("connection successful !!! : ",connectionInstance.connection.host)
//     }catch(err){
//         console.error("ERROR : ",err);
//         process.exit(1);
//     }
// })()