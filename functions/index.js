//Global variables
const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login, signUp} = require("./handlers/users");

//Routes- scream
app.get("/screams", getAllScreams);
//Post one scream
app.post("/scream", FBAuth, postOneScream);
//SignUp Route-users route
app.post("/signup", signUp);
// Login Route-users route
app.post("/login", login );

exports.api = functions.https.onRequest(app);
