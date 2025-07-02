require("dotenv").config();
const connectDatabase = async () =>{
    try {
        const mongoose = require('mongoose');
        const DB_URL = process.env.DB_URL;
        if (!DB_URL) {
            throw new Error('DB_URL environment variable is not defined');
        }
        await mongoose.connect(DB_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}
module.exports = connectDatabase;