const express = require('express');
const mongoose = require('mongoose');

// ROUTER imports
const pageRouter = require('./routers/pageRouters');
const courseRouter = require('./routers/courseRouters');
const categoryRouters = require('./routers/categoryRouters');
const userRouters = require('./routers/userRouters');

const port = 3000;
const app = express();

// DB connection
mongoose.set('strictQuery', false);
mongoose
    .connect('mongodb://localhost/startedu-db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('connection succsess'));

// TAMPLATE ENGINGE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// ROUTER
app.use('/', pageRouter);
app.use('/courses', courseRouter);
app.use('/categories', categoryRouters);
app.use('/users', userRouters);


app.listen(port, () => {
    console.log(`server ${port}' unda başladı.`);
});
