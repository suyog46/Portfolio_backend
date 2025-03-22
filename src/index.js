import dotenv from "dotenv"


dotenv.config({
    path:"./.env"
}
)

import connectDb from "./db/index.js";
import app from "./app.js";


const port=process.env.port || 4000
connectDb().then(()=>{
    app.listen(port,()=>{
        console.log("server is running in the port",port)
    })
}).catch((error)=>{
    console.log("error in connecting",error)
})

