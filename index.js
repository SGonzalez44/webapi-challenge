require('dotenv').config();
const app = require('express')();
const servers = require('./servers');




app.use('/api', servers)

const port = process.env.PORT || 4400;

app.listen(port, () => {

    console.log(`The server is listening localhost:${port}`)});