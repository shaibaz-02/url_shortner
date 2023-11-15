const express=require('express');
const path=require('path');
const cookieParser=require('cookie-parser');
const {restrictToLoggedInUserOnly,checkAuth}=require('./middlewares/auth')
const {connectToMongoDB} = require('./connect'); 
const URL=require('./models/url')
const { connect } = require('mongoose');
const app=express();

const urlRouter=require('./routes/url')
const staticRouter=require('./routes/staticRouter')
const userRoute=require('./routes/user')
 
connectToMongoDB('mongodb://127.0.0.1:27017/short-url').then(()=> 
console.log("izzat se connect hojao"))
.catch((err)=> console.log("bhaii kitne baar aakhir"))

app.set('view engine','ejs');
app.set("views",path.resolve("./views"))


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

app.use('/url',restrictToLoggedInUserOnly,urlRouter);
app.use('/user',userRoute);
app.use('/',checkAuth,staticRouter);

app.get('/url/:shortId',async (req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId
    },
    { $push :{
        visitHistory:{
            timestamps:Date.now()
        }
    }})
    res.redirect(entry.redirectURL)
})

app.listen(8000,()=>{
    console.log("started the port 8000 to work on project!!");
})