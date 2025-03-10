import dotenv from 'dotenv';
dotenv.config(); // ✅ Ensure dotenv loads before anything else

import connectDB from './db/index.js';
import { app } from './app.js';

console.log("Mongo URI:", process.env.MONGO_URI);  // ✅ Debugging line

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to DB:", error);
    });
