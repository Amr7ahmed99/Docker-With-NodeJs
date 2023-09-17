const express= require("express");
const port= process.env.PORT || 4000;
const app= express();  
const mongoose= require('mongoose');

const DB_USER= 'root';
const DB_PASSWORD= 'example';
const DB_PORT= 27017;
const DB_HOST= 'mongo';
mongoose
    .connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`)
    .then( _=> console.log('connected to db.'))
    .catch(err=> console.log('failed to connect with db.', err));

app.get('/', (req, res)=> res.send("<h1> Hello Node, I'm docker</h1>"));

app.listen(port, ()=> console.log(`app is up and running on port: ${port}`));