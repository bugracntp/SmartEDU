const express = require('express');

const ejs = require('ejs');

const port = 3000;
const app = express();

// TAMPLATE ENGINGE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));

// ROUTERS

app.get('/',(req, res)=>{
    res.render('index')
})


app.listen(port, ()=>{
    console.log(`server ${port}' unda başladı.`)
})