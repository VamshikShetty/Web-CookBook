# Nodejs-google-Login

Download nodejs from : https://nodejs.org/en/

Required modules:

1. npm install express

2. npm install mongodb

3. npm install body-parser 

4. npm install multer (multi-part data)

5. npm install express-session

6. npm install cookie-parser

7. npm install ejs  ( templating example -> https://scotch.io/tutorials/use-ejs-to-template-your-node-application )

8. npm install googleapis (google auth -> https://github.com/google/google-api-nodejs-client)


download mongodb from: https://docs.mongodb.com/manual/installation/

after installation run :

"....\MongoDB\Server\3.6\bin\mongod" --dbpath ".....\data\db"

"....\MongoDB\Server\3.6\bin\"  -> where mongodb files are after installation

".....\data\db"  ->  path where we want to store our database/collection


## Mongodb

### Create new database
```
use nodejsLogin
```

### Create a collection to hold login details
```
db.createCollection("LoginDetails",{
		validator:{ 
			$jsonSchema: {
					bsonType: "object", required: [ "email", "name", "password" ],
					properties: {

						phone: { 
							bsonType: "long",
							description: "must be a Long and is not required"
						},

						email: { 
							bsonType: "string",
							description: "must be a string and is required"
						},

						name: { 
							bsonType: "string",
							description: "must be a string and is required"
						},

						dob: {
							bsonType: "string",
							description: "must be a string in format of YYYY-MM-DD and is not required"
						},

						password:{
							bsonType:"string",
							description: "Stores the password"
						}}}}})
```
### Setting email to be unique
```
db.LoginDetails.createIndex({"email":1},{unique:true})
```

