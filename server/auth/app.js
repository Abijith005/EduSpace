import express from "express";
import morgan from "morgan";

const app = express();
const port=process.env.PORT||5010
app.use(morgan("dev"));

app.use('/',(req,res)=>{
    console.log('reached here');
    res.send('aatuh service working')
})
app.listen(port,()=>{
    console.log('auth service running in port 5010');
})
