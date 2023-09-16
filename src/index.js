const express= require("express");
const port= process.env.PORT || 4000;
const app= express();  

app.get('/', (req, res)=> res.send("<h1> Hello Node, I'm docker</h1>"));

app.listen(port, ()=> console.log(`app is up and running on port: ${port}`));