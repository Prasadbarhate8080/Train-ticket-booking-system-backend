import dotenv from 'dotenv';
import { connectDB } from './db/dbConnection.js';
import { app } from './app.js';

dotenv.config({
    path: '../.env'
});

connectDB()
.then(()=>{
    app.on("error",(error) => {
        console.log("Error: ",error);
        throw error;
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGODB CONNECTION FAILD !!!",err);
})