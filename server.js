//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookiePraser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const homeRoute = require('./api/routes/homeRoute');
const apiRoute = require('./api/routes/apiRoute');
const userRoute = require('./api/routes/userRoute');
const dotEnv = require('dotenv');
// Use env variables
dotEnv.load()

//Connect to Database
mongoose.connect(process.env.DATABASE_URI);

//Init Express app
const app = express();

//Body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Logger middleware
app.use(logger('dev'));

app.use(express.static(__dirname+'/src'));
//Set App Routes
app.use('/', homeRoute);
app.use('/api', apiRoute);
app.use('/user', userRoute);

//Start server to listen to HTTP requests
app.listen(process.env.PORT || 3001, () => {
  console.log('Server is LIVE at port '+(process.env.PORT || 3001));
})
