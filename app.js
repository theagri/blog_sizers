/**
 * Module dependencies.
 */
var express = require('express');
var mvcController = require('./modules/mvccontroller.js');
//var httpRequest = require('./modules/httpRequest.js').httpRequest;

//var ejs = require('ejs');
//var util = require('./util.js');
//var properties = require('./properties.js');
//=>Modulization

var app = module.exports = express.createServer();

var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  //app.set('view options', { layout: false }) 
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});


//httpRequest.request("http://blog.naver.com/tb/oralhazard/30133536689");


//Is there any better idea????
app.all("/",function(req,res,next){
	//util.router(req,res,next);
	mvcController.mvcRoute(req,res,next);
});
app.all("/:var1",function(req,res,next){
	mvcController.mvcRoute(req,res,next);
});
app.all("/:var1/:var2",function(req,res,next){
	mvcController.mvcRoute(req,res,next);
});
app.all("/:var1/:var2/:var3",function(req,res,next){
	mvcController.mvcRoute(req,res,next);
});

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);