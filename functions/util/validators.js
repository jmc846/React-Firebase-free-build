//helper functions
const isEmail = (email) => {
  const regEx =
    '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}]|)(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;';
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

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

exports.validateLoginData = (data) =>{
  let errors = {};

  if (isEmpty(user.email)) errors.email = "MUST NOT BE EMPTY";
  if (isEmpty(user.password)) errors.password = "MUST NOT BE EMPTY";
  return{
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}