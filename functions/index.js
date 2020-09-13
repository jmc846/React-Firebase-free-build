//Global variables
const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { login, signUp, uploadImage} = require("./handlers/users");

//Routes- scream
app.get("/screams", getAllScreams);
//Post one scream
app.post("/scream", FBAuth, postOneScream);
//SignUp Route-users route
app.post("/signup", signUp);
// Login Route-users route
app.post("/login", login );
// Upload Route-users route
app.post('/user/image', FBAuth, uploadImage)

exports.api = functions.https.onRequest(app);
