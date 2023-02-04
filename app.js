const express = require('express');
const mongoose = require('mongoose');
var methodOverride = require('method-override')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv').config();
const flash = require('connect-flash');

// ROUTER imports
const pageRouter = require('./routers/pageRouters');
const courseRouter = require('./routers/courseRouters');
const categoryRouters = require('./routers/categoryRouters');
const userRouters = require('./routers/userRouters');

const app = express();

// DB connection
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DATABASE_URL, {
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
        store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    })
); // for session middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});
app.use(
    methodOverride('_method', {
      methods: ['POST', 'GET'],
    })
  );


// ROUTER
app.use('*', (req, res, next) => {
    userIN = req.session.userID;
    next();
});
app.use('/', pageRouter);
app.use('/courses', courseRouter);
app.use('/categories', categoryRouters);
app.use('/users', userRouters);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`server ${process.env.SERVER_PORT}' unda başladı.`);
});
