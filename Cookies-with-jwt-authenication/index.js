const express = require('express')
const cookieParser  = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cookieParser())

const authorization = (req,res,next)=>{
  const token = req.cookies.access_token;
  if(!token){
    return res.status(403).send("Token should be Present! 😊 " )
  }try {
    const data = jwt.verify(token , "Cookies- secret-key");
    req.userId = data.id ;
    req.userRole = data.role;
    return next()  
  } catch (error) {
    return res.status(500).send(error)
  }
};

app.get('/',(req,res)=>{
  return res.status(200).json({message:"Hello Cookies  🤘"})
});

app.post('/login',(req,res)=>{
  const token = jwt.sign({id:7 , role:"captain"},"Cookies- secret-key");
  return res
   .cookie("access_token",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production"
   })
   .status(200)
   .json({message:"Logged in successfully 😊 👌" })
})

app.get('/protected',authorization,(req,res)=>{
  return res.json({ user: { id: req.userId, role: req.userRole } });
})


app.get('/logout',authorization,(req,res)=>{
  return res
  .clearCookie("access_token")
  .status(200)
  .json({message:"Log out Successfully 😏 🍀 👋 "})
})


app.listen(4000,()=>{
  console.log("Express app running on port " + (4000) )
})