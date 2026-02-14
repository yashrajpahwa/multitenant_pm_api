import { ApiError } from "../utils/errors.js";

export const validate = (schema) => {
  return async (req, _res, next) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = validated.body;
      req.params = validated.params;
      req.query = validated.query;

      next();
    } catch (error) {
      next(error);
    }
  };
};
