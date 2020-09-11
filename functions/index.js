const functions = require('firebase-functions');
const admin = require('firebase-admin'); 

const app = require('express')();
admin.initializeApp();

const config = {
    apiKey: "AIzaSyC_S1v7tg4oeXHtdJJfMmni5WS-dJSj1ro",
    authDomain: "react-firebase-free.firebaseapp.com",
    databaseURL: "https://react-firebase-free.firebaseio.com",
    projectId: "react-firebase-free",
    storageBucket: "react-firebase-free.appspot.com",
    messagingSenderId: "561640046613",
    appId: "1:561640046613:web:42e8b1036196f89dd60e1c",
    measurementId: "G-PXSH9ZRYWX"
};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/screams', (req, res)=>{
 db
    .collection('screams')
    .orderBy('createdAt','desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
             screamId: doc.id,
             body:doc.data().body,
             userHandle: doc.data().userHandle,
             createdAt:doc.data().createdAt

            })        
        })
        return res.json(screams);
    })
    .catch(err => console.error(err));
})

app.post('/scream', (req, res)=>{
    if(req.method !== 'POST'){
         return res.status(400).json({ error: `Method not allowed`});
    }
  const newScream = {
   body: req.body.body,
   userHandle: req.body.userHandle,
   createdAt:new Date().toISOString()
  };

  db
      .collection('screams')
      .add(newScream)
      .then(doc =>{
          res.json({ message: `document ${doc.id} created successfully`})
      })
      .catch(err => {
          res.status(500).json({ error: `something wrong`});
          console.error(err);
      });
    });


    //SignUp Route
    app.post('/signup',(req, res)=>{
       const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
       };

      //TODO: valdiate data

      db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle: 'this handle is already taken'});
            } else{
               return  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)  
            }
        })
        .then(data =>{
         return data.user.getIdToken()
        })
        .then(token => {
         return res.status(201).json({ token });

        })
        .catch((err) =>{
         console.error(err);
        //  if(err.code === 'auth/email-already-in-use') {
        //   return res.status(400).json({ email: 'Email is already is use'});
        // }else{
         return res.status(500).json({ error: err.code });
        });
    });

