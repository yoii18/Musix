import express from "express";
import cors from "cors";
import validationRoutes from "./routes/validationRoutes";

const PORT: number = parseInt(process.env.PORT || '3000');

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        msg: "Healthy Server",
    })
})

app.use('/api/v1/validationRoutes', validationRoutes)

app.listen(PORT, () => {
    `listening at port: ${PORT}`
})