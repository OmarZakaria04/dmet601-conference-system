const express = require("express")
const app = express()


app.get("/", (req, res) =>{
    res.send("Test")
})

app.listen("5000", ()=>{
    console.log("Server Is working fine...")
})


