const express=require('express');
const morgan=require('morgan');
const helmet=require('helmet');
const compression = require('compression');
const app=express();
const {checkOverload}=require('./helpers/check.connect');


//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

//init db
require('./dbs/init.mongodb');
checkOverload()
//init routes
app.get('/',(req,res,next)=>{
    const str='hehe hahahahahaha'
    return res.status(200).json({
      message:'Hello World',
      metadata:str.repeat(1000000)
    })
});

// handling errors
module.exports=app;