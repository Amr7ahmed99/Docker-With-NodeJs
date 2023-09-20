const express= require("express");
const mongoose= require('mongoose');
const redis= require('redis');
const {Client: PostgresClient}= require('pg');
let redisClient= null;
let pgClient= null;

//init App
const port= process.env.PORT || 4000;
const app= express();  

//connect to Redis
const ConnectToRedis= async ()=>{
    if(redisClient){
        return;
    }
    const REDIS_PORT= 6379;
    const REDIS_HOST= 'redis';
    redisClient= redis.createClient({
        url: `redis://${REDIS_HOST}:${REDIS_PORT}`
      });
    redisClient.on('error', err=> console.log('failed to connect to redis.', err));
    redisClient.on('connect', ()=> console.log('connected to redis...'));
    await redisClient.connect();
};

//connect to MongoDB
const ConnectToMongoDB= async ()=>{
    const DB_USER= 'root';
    const DB_PASSWORD= 'example';
    const DB_PORT= 27017;
    const DB_HOST= 'mongo';
    await mongoose
        .connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`)
        .then( _=> console.log('connected to mongo db.'))
        .catch(err=> console.log('failed to connect to mongo db.', err));
};

//connect to Postgres
const ConnectToPostgres= async ()=>{
    if(pgClient){
        return;
    }
    const PG_DB_USER= 'root';
    const PG_DB_PASSWORD= 'example';
    const PG_DB_PORT= 5432;
    const PG_DB_HOST= 'postgres';
    const URI= `postgresql://${PG_DB_USER}:${PG_DB_PASSWORD}@${PG_DB_HOST}:${PG_DB_PORT}/dockerDB`;
    pgClient= new PostgresClient({
        connectionString: URI
    });
    await pgClient
        .connect()
        .then( _ => console.log("connected to postgres db..."))
        .catch(err => console.log("failed to connect to postgres db: ", err));
};


// app routes
app.get('/', async (_, res)=> {
    ConnectToRedis();
    await redisClient.set('products', 'products...');
    res.send("<h1> Hello AWS, I'm Docker-Hub</h1>")
});
app.get('/data', async (_, res)=>{
    ConnectToRedis();
    ConnectToPostgres();
    ConnectToMongoDB();
    const products= await redisClient.get('products');
    const {rows: pgProducts} = await pgClient.query('SELECT * FROM products');
    await pgClient.end();
    res.send(`<h1> Hello Node </h1> <h2>Redis: ${products}</h2> <h2> Postgres: ${JSON.stringify(pgProducts)}</h2>`);
});

app.listen(port, ()=> console.log(`app is up and running on port: ${port}`));
