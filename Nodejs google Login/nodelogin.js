
var express = require('express');
var util = require('util');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

// Google
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');

// session
var cookieParser = require('cookie-parser');
var session = require('express-session');

// finished defining required module
//
//

// set the view engine to ejs
app.set('view engine', 'ejs');

// to convert strings to long
var long = require('mongodb').Long;
var url = "mongodb://localhost:27017/";

// getting the current path
var currentPath = path.join(__dirname+"/");

// static folder contains two sub folders i.e css and js
app.use("/static",express.static(currentPath+"static"));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 

// Session's secret key
app.use(cookieParser());
app.use(session({secret: "389742jklNASF984w", resave: true, saveUninitialized: true}));

// Defining routes
app.get('/', function(req, res){
	if(req.session.email)
	{
		res.redirect('/dashboard');
	}
	else
	{
		res.render("Login");	
	}
});

app.post('/signup',function(req,res){

	var name = req.body.name;
	var email = req.body.email;
	var phone = req.body.phone;
	var password = req.body.password;
	var dob = req.body.dob

	MongoClient.connect(url,function(err,db){
		if(err) throw err;

		//  Database object 
		var dbo = db.db("nodejsLogin");

		
		var json_obj = {name:name, email:email, phone:long.fromString(phone), password:password, dob:dob};

		dbo.collection("LoginDetails").insertOne(json_obj,function(err,result){
			if(err) throw err;
			db.close();

			req.session.email = email;
			res.redirect('/dashboard');
		});
	});
});

app.post('/login',function(req,res)
{

	var email = req.body.email;
	var pass = req.body.password;

	if(pass=="")
	{
		res.redirect('/');
	}

	var password = "";

	// check if password matches otherwise redirect back to
	MongoClient.connect(url,function(err,db)
	{
		if(err) throw err;
		
		var dbo = db.db("nodejsLogin");
		dbo.collection("LoginDetails").find({email:email},{password:1}).toArray(function(err,result)
		{
			if(result.length==0)
			{
				res.redirect('/');
			}
			else
			{
				password = result[0]['password'];
				db.close();

				// checking the password
				if(password!=pass)
				{
					res.redirect('/');
				}
				else
				{
					// save session and redirect to dashboard
					req.session.email = email;
					res.redirect('/dashboard');
				}
			}
		});
	});
});


app.get('/dashboard',function(req,res){

	if(!req.session.email)
	{
		res.redirect('/');
	}
	else
	{
		var email = req.session.email;
		MongoClient.connect(url,function(err,db)
		{
			if(err) throw err;
		
			var dbo = db.db("nodejsLogin");
			dbo.collection("LoginDetails").find( { email:email },{ fields:{_id: 0} }).toArray(function(err,result)
			{
				db.close();
				console.log(result);
				res.render("dashboard",{ data:result[0] });
			});
		});
	}
});

app.get('/logout',function(req,res){
	// unset the session
	req.session.email ="";
	res.redirect('/');
});




//Setting Google auth

var oauth2Client = new OAuth2(
  "525696575535-6k6ollp4gkv7sncrajj377gg8pjovm0i.apps.googleusercontent.com",
  "k70jHl551y3HJTaxJlAZaX4o",
  "http://localhost:3000/authgoogle"
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  'https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

var googleurl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  scope: scopes,
});

app.get('/googleSignin',function(req,res){
	res.redirect(googleurl);
});


app.get('/authgoogle',function(req,res){

	var code = req.query.code;
	oauth2Client.getToken(code, function (err, tokens) {

  		if (!err) 
  		{
    		oauth2Client.setCredentials(tokens);
    		//console.log(code);

    		plus.people.get({
  				auth: oauth2Client,
  				userId: 'me'
				}, function (err, response) {

					//console.log(util.inspect(response, false, null));
  					var email = response['data']['emails'][0]['value'];
  					var birthday = response['data']['birthday'];
  					var name = response['data']['displayName']

  					//console.log(email);
  					
  					// check if user exists in database or not
  					MongoClient.connect(url,function(err,db)
					{
						if(err) throw err;
		
						var dbo = db.db("nodejsLogin");
						dbo.collection("LoginDetails").find({email:email},{password:1}).toArray(function(err,result)
						{
							if(result.length==0)
							{
								// new user ask for password
								req.session.newemail = email;
								req.session.newname = name;
								req.session.newbirthday = birthday;

								//console.log(email+" "+name+" "+birthday);
								res.redirect('/newuser');
							}
							else
							{

								// save session and redirect to dashboard
								req.session.email = email;
								res.redirect('/dashboard');

							}
						});
					});
				});
  		}
  		else
  		{
  			res.redirect('/login');
  		}
	});

});

app.get('/newuser',function(req,res){

	if(req.session.newemail && req.session.newname)
	{
		res.render("newuser");
	}
	else
	{
		res.redirect('/');
	}

});

app.post('/signinNewuser',function(req,res){

	var password = req.body.password;

	MongoClient.connect(url,function(err,db){
		if(err) throw err;

		//  Database object 
		var dbo = db.db("nodejsLogin");

		var json_obj = {name:req.session.newname, email:req.session.newemail, password:password, dob:req.session.newbirthday};
		console.log(json_obj);
		dbo.collection("LoginDetails").insertOne(json_obj,function(err,result){
			if(err) throw err;
			db.close();

			req.session.email = req.session.newemail;
			req.session.newemail="";
			req.session.newbirthday ="";
			name:req.session.newname ="";

			
			res.redirect('/dashboard');
		});


	});

});

// Setting listening port
app.listen(3000);

// While in remote server set port to 80
// app.listen(80);