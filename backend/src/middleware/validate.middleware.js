import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  if (!schema) return next();

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorDetails = error.details.map((detail) => detail.message);
    throw new ApiError(400, "Validation Error", errorDetails);
  }

  req.body = value;
  next();
};
