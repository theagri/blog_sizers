var mongoose = require('mongoose');
var properties = require('./properties.js');
var models = require('./modules/models.js');
var svcController = require('./modules/svccontroller.js');

//Prototyping Date Object 
Date.prototype.format = function(f) { 
	if (!this.valueOf()) return " "; 
  
	var weekName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
	var d = this; 
	  
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) { 
		switch ($1) { 
			case "yyyy": return d.getFullYear(); 
			case "yy": return (d.getFullYear() % 1000).zf(2); 
			case "MM": return (d.getMonth() + 1).zf(2); 
			case "dd": return d.getDate().zf(2); 
			case "E": return weekName[d.getDay()]; 
			case "HH": return d.getHours().zf(2); 
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); 
			case "mm": return d.getMinutes().zf(2); 
			case "ss": return d.getSeconds().zf(2); 
			case "a/p": return d.getHours() < 12 ? "AM" : "PM"; 
			default: return $1; 
		} 
	}); 
}; 
//But I don't think it's a good idea.
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;}; 
String.prototype.zf = function(len){return "0".string(len - this.length) + this;}; 
Number.prototype.zf = function(len){return this.toString().zf(len);};

//It's a useful mehtod
var dump = exports.dump = function (obj, name) {
	var indent = "  ";
	if (typeof obj == "object") {
		var child = null;
		var output = (name) ? indent + name + "\n" : "";
		indent += "\t";

		for (var item in obj)
		{
			try {
				child = obj[item];
			} catch (e) {
				child = "<Unable to Evaluate>";
			}

			if (typeof child == "object") {
				output += dump(child, item);
			} else {
				output += indent + item + ": " + child + "\n";
			}
		}
		return output;
	} else {
		return obj;
	}
};


//Routing?? or MVC Controlling??
var router = exports.router = function(req, res, next){
	var var1="",var2="",var3="";
	
	//Am I doing the right thing??
	if(req.params.var1) var1 = req.params.var1;
	if(req.params.var2) var2 = req.params.var2;
	if(req.params.var3) var3 = req.params.var3;

	if(var1=="") res.render('index',{title:"MAIN"});
	else if(var1=="callservice") {
		//It's Service Oriented Architecture
		svcController.callService(req, res);
	}
	else if(var1=="postlist") {
		var oSrch = {};
		var title = "POST LIST";
		if(var2 != "all") 	oSrch = {"postCate":var2};
		if(var2=="all") title += " - ALL";
		else if(var2=="dev") title += " - Develope";
		else if(var2=="pol") title += " - Politics";
		else if(var2=="les") title += " - Leisure";
		mongoose.connect(properties.mongodbUrl);
		models.blogposts.find(oSrch).sort('date',-1).execFind( function (err, docs) {
			mongoose.disconnect();
			if(err){//throw err;
				console.log(err);
			}else{
				//oOutput["blogposts"] = docs;// docs is an array
				console.log('rietrived!');
				for(var i=0;i<docs.length;i++){
					docs[i]["date1"] = docs[i].date.format("yyyy-MM-dd HH:mm:ss");
				}
		 	}
			//Blah.find({}).sort('date',-1).execFind(function(err,docs){ });

			var oBind = {};
			//if(docs.length > 0) oBind = docs[0];
			oBind["title"] = title;
			oBind["postlist"] = docs;
			oBind["lcate"] = var2;
			res.render('postlist',oBind);
		});
	}
	else if(var1=="postview") {
		if(!var2) {
			res.end();
			return;
		}
		mongoose.connect(properties.mongodbUrl);
		models.blogposts.findOne({_id:var2}, function (err, docs) {
			mongoose.disconnect();
			if(err){//throw err;
				console.log(err);
			}else{
				//oOutput["blogposts"] = docs;// docs is an array
				console.log('rietrived! content');
				docs["date1"] = docs.date.format("yyyy-MM-dd HH:mm:ss");
				docs["postContent"] = docs.postContent.replace(/\r\n/gi,"<br/>");
		 	}
			var oBind = {};
			//if(docs.length > 0) oBind = docs[0];
			oBind["title"] = docs.postTitle;
			oBind["postview"] = docs;
			oBind["lcate"] = (req.query.lcate||"");
			res.render('postview',oBind);
		});
	}
	else if(var1=="guestbook") res.render('guestbook',{title:"Guest Book"});
	//else if(var1=="guestbook2") res.render('guestbook2',{title:"Guest Book"});
	else if(var1=="profile") res.render('profile',{title:"My Profile"});
	else if(var1=="admin") {
		if(var2!=properties.adminToken) {
			res.end("Admin authentication is not valid!!");return;
		}
		res.render('admin',{title:"Admin",adminToken:var2});
	}
	else next();
};
