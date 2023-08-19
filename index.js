const express= require("express");
const port= 4000;
const app= express();  

app.get('/', (req, res)=> res.send("<h1> Hello Node </h1>"));

app.listen(port, ()=> console.log(`app is up and running on port: ${port}`));
