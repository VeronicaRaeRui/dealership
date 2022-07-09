const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')

const app = express();


const routes = require('./routes/routes');

const port = 3000;


// create connection to database
// the mysql.createConnection function takes in a configuration object which 
//contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dealership_proj_db',
    multipleStatements: true
});


// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

//variable db is used in other files
global.db = db;

// configure middleware

//app.set(name, value)
//Assigns setting name to value. 
//You may store any value that you want, but certain names can be used to 
//configure the behavior of the server. These special names are listed in the 
//app settings table.

//Calling app.set('foo', true) for a Boolean property is the same as calling 
//app.enable('foo'). Similarly, calling app.set('foo', false) for a Boolean 
//property is the same as calling app.disable('foo').


// set express to use this port
app.set('port', process.env.port || port); 
// set express to look in this folder to render our view
//__dirname is an environment variable that tells you the absolute path of the 
//directory containing the currently executing file.
//views: A directory or an array of directories for the application's views. 
//If an array, the views are looked up in the order they occur in the array
app.set('views', __dirname + '/views'); 
// configure template engine
//The default engine extension to use when omitted.
//NOTE: Sub-apps will inherit the value of this setting.
//EJS is a simple templating language that lets you generate 
//HTML markup with plain JavaScript.
app.set('view engine', 'ejs'); 

//body-parser：Parse incoming request bodies in a middleware before your handlers, 
//available under the req.body property.
//bodyParser.urlencoded returns middleware that only parses urlencoded bodies and only looks at requests 
//where the Content-Type header matches the type option. 
//This parser accepts only UTF-8 encoding of the body and supports automatic 
//inflation of gzip and deflate encodings.

//A new body object containing the parsed data is populated on the request object 
//after the middleware (i.e. req.body). This object will contain key-value pairs, 
//where the value can be a string or array (when extended is false), 
//or any type (when extended is true).

app.use(bodyParser.urlencoded({ extended: false }));

//bodyParser.json([options])
//Returns middleware that only parses json and only looks at requests 
//where the Content-Type header matches the type option. 
//This parser accepts any Unicode encoding of the body and supports automatic 
//inflation of gzip and deflate encodings.

//A new body object containing the parsed data is populated on the request object 
//after the middleware (i.e. req.body).
app.use(bodyParser.json()); 

// configure express to use public folder
/* express.static(root, [options])
This is a built-in middleware function in Express. It serves static files and is based on serve-static.

The root argument specifies the root directory from which to serve static assets. 
The function determines the file to serve by combining req.url with the provided 
root directory. When a file is not found, instead of sending a 404 response, 
it instead calls next() to move on to the next middleware, allowing for stacking 
and fall-backs.
The path.join() method joins the specified path segments into one path.
*/ 
app.use(express.static(path.join(__dirname, 'public'))); 
// configure fileupload
/**
 * Simple express middleware for uploading files.
 * When you upload a file, the file will be accessible from req.files.
 */
app.use(fileUpload()); 

app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

// routes for the app
//The app.use() function is used to mount the specified middleware function(s) at the path which is being specified. 
//It is mostly used to set up middleware for your application.
//app.use(path, callback)
//path: It is the path for which the middleware function is being called. 
//It can be a string representing a path or path pattern or regular expression pattern to match the paths.
//callback: It is a middleware function or a series/array of middleware functions.
app.use('/', routes);
app.use('/addVehicle', routes);

app.get('*', function(req, res, next){
    res.status(404);

    res.render('404.ejs', {
        title: "Page Not Found",
    });

});


// set the app to listen on the port
//Starts a UNIX socket and listens for connections on the given path. 
//This method is identical to Node’s http.Server.listen().
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

//to start the app
// use node app.js