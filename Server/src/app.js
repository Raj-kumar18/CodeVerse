import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
// Middleware

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// Routes
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/categories", categoryRoutes);


export { app };