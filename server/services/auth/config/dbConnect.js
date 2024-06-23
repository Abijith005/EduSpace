import mongoose from "mongoose";
function dbConnect() {
  mongoose
    .connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    .then(() => console.log("db connected"))
    .catch((err) => console.log('connection error',err));
}

export default dbConnect;
