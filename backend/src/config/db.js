const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dsa-tracker";
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("MongoDB connected");
};

module.exports = connectDB;
