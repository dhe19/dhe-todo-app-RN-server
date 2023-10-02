import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import todoTask from "./src/models/todoTask.js";
const app = express();


dotenv.config();
app.use(express.urlencoded({ extended: true })); // Add this line
app.use(express.json()); // Add this line


app.get("/", async (req, res) => {
    try {
        const tasks = await todoTask.find({});
        res.json(tasks);
    } catch (err) {
        console.error(err);
    }
});

app.post("/", (req, res) => {
    const { description, title } = req.body;
    const task = new todoTask({
        description,
        title,
    });

    task.save().then(resp => res.status(201).json({ message: "Resource created successfully", resp })
    ).catch(err => console.log(err));

})

app.put("/", (req, res) => {
    const { id, title, description } = req.body;
    todoTask.findByIdAndUpdate(id, { title, description })
        .then(resp => res.status(202).json({ resp }))
        .catch(err => res.status(500).json({ err }))

})

app.delete("/", (req, res) => {
    const { id } = req.body;
    todoTask.findByIdAndDelete(id)
        .then(resp => res.status(203).json({ resp }))
        .catch(err => res.status(500).json({ err }))
})


mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, () => console.log("Server up and running"));
    })
    .catch((err) => {
        console.log(err);
    });