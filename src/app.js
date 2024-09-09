import express from "express"

const app = express()
app.get((res,req)=>{
    res.send("hello")
})


export {app}