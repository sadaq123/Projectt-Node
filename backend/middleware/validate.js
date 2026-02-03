const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ message: errorMessages });
  }
  next();
};

const schemas = {
  // Auth Schemas
  register: Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    phone: Joi.string().required().min(9),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('user', 'staff', 'cashier', 'accountant', 'admin', 'superadmin')
  }),
  login: Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required()
  }),

  // Room Schemas
  room: Joi.object({
    roomNumber: Joi.string().required(),
    type: Joi.string().valid('Single', 'Double', 'Suite', 'Deluxe', 'Family', 'Apartment'),
    price: Joi.number().required().min(0),
    description: Joi.string().allow(''),
    bedrooms: Joi.number().min(1),
    bathrooms: Joi.number().min(1),
    sittingRooms: Joi.number().min(0),
    imageUrl: Joi.string().uri().allow('')
  }),

  // Food Schemas
  food: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().required(),
    description: Joi.string().allow(''),
    imageUrl: Joi.string().uri().allow('')
  })
};

module.exports = { validate, schemas };
