/* This server, unlike our previous ones, uses the express framework */
var express = require('express');
var formidable = require('formidable');  // we upload images in forms
// this is good for parsing forms and reading in the images

var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile);  // new object, old DB
// make a new express server object
var app = express();
var req = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

var fileName;

// Case 3: upload images
// Responds to any POST request
app.post('/', function (request, response){
    var form = new formidable.IncomingForm();
    form.parse(request); // figures out what files are in form

    // callback for when a file begins to be processed
    form.on('fileBegin', function (name, file){
    	// put it in /public
        fileName = file.name;
    	file.path = __dirname + '/public/' + file.name;
    	console.log("uploading ",file.name,name);
        db.run('INSERT OR REPLACE INTO photoLabels VALUES ("'+file.name+'", "", 0) '); // add to db

    });

    // callback for when file is fully recieved
    form.on('end', function (){
        requestObject = {
          "requests": [
            {
              "image": {
                "source": {"imageUri": "http://138.68.25.50:10305/" + fileName}
                },
              "features": [{ "type": "LABEL_DETECTION" }]
            }
          ]
        }
        var url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBMUxZlsk0bUbvJ_5auJkd2ObARsECX04I'; 
        req({
            url: url,
            method: "POST",
            headers: {"content-type": "application/json"},
            json: requestObject,
        }, APIcallback);

        function APIcallback(err, APIresponse, body) {
            if ((err) || (APIresponse.statusCode != 200)) {
                console.log("Got API error"); 
            } else {
                APIresponseJSON = body.responses[1];
                console.log("success");
                response.status(200);
                response.type("text/plain");
                response.send(APIresponseJSON);
            }
        }



    	// console.log('success');
    	// sendCode(201,response,'recieved file');  // respond to browser

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
        console.log("add");
        var newLabel = queryObj.label;
        var imageFile = queryObj.img;
        if (newLabel && imageFile) {
            // good add query
            // go to database! 
            db.get(
            'SELECT labels FROM photoLabels WHERE fileName = ?',
            [imageFile], getCallbackAdd);

            // define callback inside queries so it knows about imageFile
            // because closure!
            function getCallbackAdd(err,data) {
                console.log("getting labels from "+imageFile);
                if (err) {
                    console.log("error: ",err,"\n");
                } else {
                    // good response...so let's update labels
                    db.run(
                    'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
                    [data.labels+newLabel+" ", imageFile],
                    updateCallbackAdd);
                }
            }

            // Also define this inside queries so it knows about
            // response object
            function updateCallbackAdd(err) {
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
        console.log("delete");
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
    if(queryObj.op == "addToFavs") {
        var imageFile = queryObj.img;
        if(imageFile) {
            db.run(
            'UPDATE photoLabels SET favorite = 1 WHERE fileName = ?',
            [imageFile], getCallbackFav);

        }
        function getCallbackFav(err) {
            console.log("updating fav "+imageFile+"\n");
            if (err) {
                console.log(err+"\n");
                sendCode(400,response,"requested photo not found");         
            } else {
                // send a nice response back to browser
                response.status(200);
                response.type("text/plain");
                response.send("favorited "+imageFile);
            }
        }
    }
    if(queryObj.op == "deleteFromFavs") {
        var imageFile = queryObj.img;
        if(imageFile) {
            db.run(
            'UPDATE photoLabels SET favorite = 0 WHERE fileName = ?',
            [imageFile], getCallbackUnFav);

        }
        function getCallbackUnFav(err) {
            console.log("updating fav "+imageFile+"\n");
            if (err) {
                console.log(err+"\n");
                sendCode(400,response,"requested photo not found");         
            } else {
                // send a nice response back to browser
                response.status(200);
                response.type("text/plain");
                response.send("unfavorited "+imageFile);
            }
        }
    }
    if(queryObj.op == "filter") {
        var k = queryObj.keyword;
        keyword = "%" + k + "%";
        db.all(
        'SELECT * FROM photoLabels WHERE labels LIKE ?', [keyword], getfilter);

        function getfilter(err,data) {
            console.log("filtering photos");
            if (err) {
                console.log("error: ",err,"\n");
            } else {
                // send a nice response back to browser
                response.status(200);
                response.type("text/plain");
                response.send(data);
            }
        }
    }
    if(queryObj.op == "getFavs") {
        db.all(
        'SELECT * FROM photoLabels WHERE favorite = 1', getfav);

        function getfav(err,data) {
            console.log("getting favorites");
            if (err) {
                console.log("error: ",err,"\n");
            } else {
                // send a nice response back to browser
                response.status(200);
                response.type("text/plain");
                response.send(data);
            }
        }
    }
    if(queryObj.op == "getAll") {
        db.all(
        'SELECT * FROM photoLabels', getAll);

        function getAll(err,data) {
            console.log("getting all photos");
            if (err) {
                console.log("error: ",err,"\n");
            } else {
                // send a nice response back to browser
                response.status(200);
                response.type("text/plain");
                response.send(data);
            }
        }
    }
}