const express= require("express");
const mongoose= require('mongoose');
const redis= require('redis');

//init App
const port= process.env.PORT || 4000;
const app= express();  

//connect to Redis
const REDIS_PORT= 6379;
const REDIS_HOST= 'redis';
const redisClient= redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
  });
redisClient.on('error', err=> console.log('failed to connect to redis.', err));
redisClient.on('connect', ()=> console.log('connected to redis...'));
redisClient.connect();

//connect to MongoDB
const DB_USER= 'root';
const DB_PASSWORD= 'example';
const DB_PORT= 27017;
const DB_HOST= 'mongo';
mongoose
    .connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`)
    .then( _=> console.log('connected to db.'))
    .catch(err=> console.log('failed to connect with db.', err));

// app routes
app.get('/', async (_, res)=> {
    await redisClient.set('products', 'products...');
    res.send("<h1> Hello Node, I'm docker</h1>")
});
app.get('/data', async (_, res)=>{
    const products= await redisClient.get('products');
    res.send(`<h1> Hello Node </h1> <h2>${products}</h2>`);
});

app.listen(port, ()=> console.log(`app is up and running on port: ${port}`));