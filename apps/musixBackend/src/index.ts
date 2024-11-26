import express from "express";

const PORT: number = 3000;

const app = express();

app.get("/", (req, res) => {
    res.json({
        msg: "Healthy Server"
    })
})

app.listen(PORT)