import Joi from "joi";

class Validations {
    userSchema = Joi.object({
        name:Joi.string().required(),
        age:Joi.number().required()
    })
    
    postSchema = Joi.object({
        title:Joi.string().required(),
        decreption:Joi.string().required(),
        userId:Joi.string().required()
    })
}

export default new Validations();