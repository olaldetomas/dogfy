import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().required(),
  MONGODB_URI: Joi.string().required(),
  TRACKING_NUMBER: Joi.string().optional(),
});
