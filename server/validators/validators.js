const joi = require ('joi');

const loginValidator = joi.object({
  email  : joi.string().required().email(),
  password : joi.string().min(6).required()
})

module.exports = {loginValidator}