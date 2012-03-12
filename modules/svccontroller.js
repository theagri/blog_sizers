var mongoose = require('mongoose');
var properties = require('../properties.js');
var models = require('../modules/models.js');



var callService = exports.callService = function(req, res){
	var oInput = {};
	var oOutput = {"retCd":"OK"};
	if(req.body.input) {
		oInput = JSON.parse(req.body.input);
		if(oInput.svcId == "savePost"){
			if(oInput.adminToken != properties.adminToken) {
				res.end("Admin authentication is not valid!!");
				return;
			}
			if(oInput._id && oInput._id.length>1){//update
				mongoose.connect(properties.mongodbUrl);
				models.blogposts.findById(oInput._id, function(err, oblogpost) {
					if (!oblogpost) {
						//return next(new Error('Could not load Document'));
						mongoose.disconnect();
						console.log(err);
						res.end();
					} else {
						// do your updates here
						oblogpost.postCate = unescape(oInput.postCate);
						oblogpost.postTitle= unescape(oInput.postTitle);
						oblogpost.postContent = unescape(oInput.postContent);
						oblogpost.save(function(err) {
							mongoose.disconnect();
							if (err) {
								console.log(err);
								oOutput.retCd = "ER";
							} else {
								console.log('saved!');
							}
							res.end();
						});
					}
				});
			} else {
				var oblogpost = new models.blogposts();
				oblogpost.postCate= unescape(oInput.postCate);
				oblogpost.postTitle= unescape(oInput.postTitle);
				oblogpost.postContent = unescape(oInput.postContent);
				oblogpost.date = new Date();
				mongoose.connect(properties.mongodbUrl);
				oblogpost.save(function(err){
					mongoose.disconnect();
					if(err){//throw err;
						console.log(err);
						oOutput.retCd = "ER";
					}else{
						console.log('saved!');
				 	}
					res.end(JSON.stringify(oOutput));
				});
			}
		} 
		if(oInput.svcId == "delPost"){

			if(oInput.adminToken != properties.adminToken) {
				res.end("Admin authentication is not valid!!");
				return;
			}
			mongoose.connect(properties.mongodbUrl);
			models.blogposts.remove({"_id":oInput._id}, function(err) {
				mongoose.disconnect();
				if (err) {
					console.log(err);
					oOutput.retCd = "ER";
				} else {
					console.log('saved!');
				}
				res.end();
			});
		} 
		if(oInput.svcId == "getPostList"){
			mongoose.connect(properties.mongodbUrl);
			models.blogposts.find({}).sort('date',-1).execFind(function (err, docs) {
				mongoose.disconnect();
				if(err){//throw err;
					console.log(err);
					oOutput.retCd = "ER";
				}else{
					oOutput["blogposts"] = docs;// docs is an array
					console.log('rietrived!');
			 	}
				res.end(JSON.stringify(oOutput));
			});
		}
	}
	else res.end();
}