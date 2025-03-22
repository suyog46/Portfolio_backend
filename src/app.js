import express from "express";
import cors from "cors";

import { handleuser } from "./controller/user.controller.js";

const app=express();
app.use(cors())

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.post("/pushfeedback",handleuser);

export default app
