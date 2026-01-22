import validations from "./validations.js";

export const validateUser = (req, res, next) => {
    const { error } = validations.userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

export const validatePost = (req, res, next) => {
    const { error } = validations.postSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};