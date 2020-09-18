//helper functions
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if (email.match(regEx)) return true;
  else
   return false;
};
//if empty functions
const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};
//validates email and password via helper functions
exports.validateSignupData = (data) =>{
let errors = {};

if (isEmpty(data.email)) {
  errors.email = "MUST NOT BE EMPTY";
} else if (!isEmail(data.email)) {
  errors.email = "MUST BE A VALID EMAIL";
}
if (isEmpty(data.password)) errors.password = "MUST NOT BE EMPTY";
if (data.password !== data.confirmPassword)
  errors.confirmPassword = "PASSWORD MUST MATCH";
if (isEmpty(data.handle)) errors.handle = "MUST NOT BE EMPTY";
return {
  errors,
  valid: Object.keys(errors).length === 0 ? true : false
}
}
//validates email and password via helper functions
exports.validateLoginData = (data) =>{
  console.log(data)
  let errors = {};
  let user= { email: data.email, password: data.password };

  if (isEmpty(user.email)) errors.email = "MUST NOT BE EMPTY";
  if (isEmpty(user.password)) errors.password = "MUST NOT BE EMPTY";
  return{
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}
//user details function
exports.reduceUserDetails = (data)=> {
let userDetails = { email: data.email, password: data.password, bio: data.bio, website: data.website};
if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
if(!isEmpty(data.website.trim())){
//https://website.com
if(data.website.trim().substring(0,4)!=='http'){
userDetails.website = `http://${data.website.trim()}`;
} else userDetails.website = data.website;
}
if(!isEmpty(data.location.trim()))userDetails.location = data.location;
return userDetails;
};