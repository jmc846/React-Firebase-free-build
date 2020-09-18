//Global variables
const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { login, signUp, uploadImage, addUserDetails} = require("./handlers/users");

//Routes- scream
app.get("/screams", getAllScreams);
//Post one scream
app.post("/scream", FBAuth, postOneScream);
// Upload Route-users route
app.post('/user/image', FBAuth, uploadImage);
//Upload user details
app.post('/user', FBAuth, addUserDetails);

//user routes
app.post("/signup", signUp);
app.post("/login", login );

exports.api = functions.https.onRequest(app);
