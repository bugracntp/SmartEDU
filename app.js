const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// ROUTER imports
const pageRouter = require('./routers/pageRouters');
const courseRouter = require('./routers/courseRouters');
const categoryRouters = require('./routers/categoryRouters');
const userRouters = require('./routers/userRouters');

const port = 3000;
const app = express();

// DB connection
const mongoCnnString = 'mongodb://localhost/startedu-db';
mongoose.set('strictQuery', false);
mongoose
    .connect(mongoCnnString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('connection succsess'));

// TAMPLATE ENGINGE
app.set('view engine', 'ejs');

// Global variables
global.userIn = null;

// MIDDLEWARES

app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
    session({
        secret: 'my_keyboard_cat', // Buradaki texti değiştireceğiz.
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({mongoUrl: mongoCnnString}),
    })
); // for session middleware

// ROUTER
app.use('*', (req, res, next) => {
    userIN = req.session.userID;
    next();
});
app.use('/', pageRouter);
app.use('/courses', courseRouter);
app.use('/categories', categoryRouters);
app.use('/users', userRouters);

app.listen(port, () => {
    console.log(`server ${port}' unda başladı.`);
});
