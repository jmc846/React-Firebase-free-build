//Global variables
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

//Routes
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
    //helper functions
    const isEmpty = (string) =>{
     if(string.trim() === '' ) return true;
    else return false;
    }

    const isEmail = (email) => {
     const regEx = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\]|)(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;'
     if(email.match(regEx)) return true;
     else return false;
    }
    //SignUp Route
    app.post('/signup',(req, res)=>{
       const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
       };
       let errors = {};
       if (isEmpty(newUser.email)) {
           errors.email = 'MUST NOT BE EMPTY';
       } else if(!isEmail(newUser.email)){
           errors.email = 'MUST BE A VALID EMAIL';
       }
       if(isEmpty(newUser.password)) errors.password = 'MUST NOT BE EMPTY';
       if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'PASSWORD MUST MATCH';
       if(isEmpty(newUser.handle)) errors.handle = 'MUST NOT BE EMPTY';

       if(Object.keys(errors).length >0) return res.status(400).json(errors);

      //TODO: valdiate data
      let token, userId;
      db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle: 'this handle is already taken'});
            } else{
               return  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)  
            }
        })
        .then(data =>{
        userId = data.user.uid;
         return data.user.getIdToken()
        })
        .then((idToken) => {
            token = idToken;
         const userCrendentials ={
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          userId
         };
         db.doc(`/users/${newUser.handle}`).set(userCrendentials);
        })
        .then(() => {
         return res.status(201).json({ token });
        })
        .catch((err) =>{
         console.error(err);
         if(err.code === 'auth/email-already-in-use') {
          return res.status(400).json({ email: 'Email is already is use'});
        }else{
         return res.status(500).json({ error: err.code });
        }
    });
});
     app.post('/login', (req, res) =>{
      const user = {
       email: req.body.email,
       password: req.body.password,
      };
       let errors = {};

       if(isEmpty(user.email)) errors.email = 'MUST NOT BE EMPTY';
       if(isEmpty(user.password)) errors.password = 'MUST NOT BE EMPTY';

       if (Object.keys(errors).length >0) return res.status(400).json(errors);

       firebase.auth().signInWithEmailAndPassword(user.email, user.password)
       .then(data =>{
        return data.user.getIdToken();
       })
       .then((token) =>{
        return res.json({token});
       })
       .catch((err) => {
        console.error(err)
        if(err.code === 'auth/wrong-password'){
        return res.status(403).json({general: 'Wrong credentials, please try again'});   
        } else return res.status(500).json({error: err.code});
       });
     });
    exports.api= functions.https.onRequest(app);