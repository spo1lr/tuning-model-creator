const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const indexRouter = require('./routes/index');

app.set('port', process.env.NODE_ENV || 5000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})

app.listen(app.get('port'), () => {
    console.info('Server is running on port ' + app.get('port'));
})

module.exports = app;
