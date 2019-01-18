const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return req.flash("error", result.error.message);
      }

      if (!req.value) { req.value = {}; }
      req.value['body'] = result.value;
      next();
    }
  },

  schemas: {
    
    authSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    
    password: Joi.string().required(),
    username: Joi.string().min(5).error(new Error("Username must be 5 characters and above")).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{7,15}$/).error(new Error("Password must a minmum of 8 letters and consist of one uppercase, one lowercase and a number!")).required(),
    confirmationPassword: Joi.any().valid(Joi.ref("password")).error(new Error('Password do not match')).required(),
    adminCode: Joi.string().allow(''),
    firstName: Joi.string().required(),
    lastName:Joi.string().allow(''),
    images: Joi.string().allow(''),
    secretToken: Joi.any().allow('')
    })
  }
}