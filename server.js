/* This server, unlike our previous ones, uses the express framework */
var express = require('express');
var formidable = require('formidable');  // we upload images in forms
// this is good for parsing forms and reading in the images

var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile);  // new object, old DB
// make a new express server object
var app = express();

// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
// An example query URL is "138.68.25.50:???/query?img=hula"
app.get('/query', function (request, response){
    console.log("query");
    query = request.url.split("?")[1]; // get query string
    if (query) {
	   answer(query, response);
    } else {
	   sendCode(400,response,'query not recognized');
    }
});

// Case 3: upload images
// Responds to any POST request
app.post('/', function (request, response){
    var form = new formidable.IncomingForm();
    form.parse(request); // figures out what files are in form

    // callback for when a file begins to be processed
    form.on('fileBegin', function (name, file){
    	// put it in /public
    	file.path = __dirname + '/public/' + file.name;
    	console.log("uploading ",file.name,name);
        db.run('INSERT OR REPLACE INTO photoLabels VALUES ("'+file.name+'", "", 0) '); // add to db

    });

    // callback for when file is fully recieved
    form.on('end', function (){
    	console.log('success');
    	sendCode(201,response,'recieved file');  // respond to browser
    });

});

app.listen(10305);

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
    response.status(code);
    response.send(message);
}

var querystring = require('querystring'); // handy for parsing query strings


function answer(query, response) {
    // query looks like: img=xx.jpg&label=ice%cream&op=delete
    queryObj = querystring.parse(query);
    if (queryObj.op == "add") {
        var newLabel = queryObj.label;
        var imageFile = queryObj.img;
        if (newLabel && imageFile) {
            // good add query
            // go to database! 
            db.get(
            'SELECT labels FROM photoLabels WHERE fileName = ?',
            [imageFile], getCallback);

            // define callback inside queries so it knows about imageFile
            // because closure!
            function getCallback(err,data) {
                console.log("getting labels from "+imageFile);
                if (err) {
                    console.log("error: ",err,"\n");
                } else {
                    // good response...so let's update labels
                    db.run(
                    'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
                    [data.labels+newLabel+" ", imageFile],
                    updateCallback);
                }
            }

            // Also define this inside queries so it knows about
            // response object
            function updateCallback(err) {
                console.log("updating labels for "+imageFile+"\n");
                if (err) {
                    console.log(err+"\n");
                    sendCode(400,response,"requested photo not found");         
                } else {
                    // send a nice response back to browser
                    response.status(200);
                    response.type("text/plain");
                    response.send("added label "+newLabel+" to "+imageFile);
                }
            }

        }
    }
    if(queryObj.op == "delete") {
        var labelToDelete = queryObj.label;
        var imageFile = queryObj.img;
        if (labelToDelete && imageFile) {
            db.get(
            'SELECT labels FROM photoLabels WHERE fileName = ?',
            [imageFile], getCallback);

            function getCallback(err,data) {
                console.log("getting labels from "+imageFile);
                if (err) {
                    console.log("error: ",err,"\n");
                } else {
                    var replacement = data.labels.replace(labelToDelete+' ', '');
                    // good response...so let's update labels
                    db.run(
                    'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
                    [replacement, imageFile],
                    updateCallback);
                }
            }

            // Also define this inside queries so it knows about
            // response object
            function updateCallback(err) {
                console.log("deleting labels for "+imageFile+"\n");
                if (err) {
                    console.log(err+"\n");
                    sendCode(400,response,"requested photo not found");         
                } else {
                    // send a nice response back to browser
                    response.status(200);
                    response.type("text/plain");
                    response.send("deleted label "+labelToDelete+" from "+imageFile);
                }
            }

        }
    }
}