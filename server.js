//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookiePraser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const config = require('./config');
const homeRoute = require('./api/routes/homeRoute');
const apiRoute = require('./api/routes/apiRoute');
const userRoute = require('./api/routes/userRoute');

//Connect to Database
mongoose.connect(config.DATABASE_URI);

//Init Express app
const app = express();

//Body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cookie-parser middleware
app.use(cookiePraser());

//Session middleware
app.use(session({secret: config.SESSION_SECRET, resave: true, saveUninitialized: false}));

//Logger middleware
app.use(logger('dev'));

app.use(express.static(__dirname+'/src'));
//Set App Routes
app.use('/', homeRoute);
app.use('/api', apiRoute);
app.use('/user', userRoute);

//Start server to listen to HTTP requests
app.listen(config.PORT, () => {
  console.log('Server is LIVE at port '+config.PORT);
})
