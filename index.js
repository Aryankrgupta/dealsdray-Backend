const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const db = require("./key").mongoURI;
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(db)
const schema = new mongoose.Schema({
    email : String,
    password : String
})

const model = mongoose.model("users", schema)

app.post("/", (req, res) => {
    const {email, password} = req.body;
    model.findOne({email: email})
    .then(user => {
        if(user){
            if(user.password === password) {
                res.json("login")
            } else {
                res.json("incorrect")
            }
        } else {
            res.json("no record")
        }
    })
})


const empScheme = new mongoose.Schema({
    name : String,
    email : String,
    contact : String,
    designation : String,
    gender : String,
    course : Array,
    image : String
})
const empModel = mongoose.model("emps", empScheme)

app.post("/sendEmp", async (req, res) => {
    const data = new empModel(req.body);
    try {
        await data.save();
        res.send("inserted");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/getEmp", (req, res) => {
    empModel.find()
    .then(u => res.json(u))
    .catch(e => res.json(e))
})

app.post("/deleteEmp", (req, res) => {
    const {id} = req.body;
    empModel.deleteOne({_id : id})
    .then(user => {
        res.json("Deleted")
    })
})
app.put("/updateEmp/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    empModel.findByIdAndUpdate(id, req.body)
        .then(updatedEmp => {
            res.json("updatedEmp");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error updating employee");
        });
});


app.listen(3001, () => {
    console.log("Server Start");
})