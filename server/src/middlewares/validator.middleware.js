const bodyValidator = (rules) => {
  return async (req, res, next) => {
    try {
      const data = req.method === "GET" ? req.query : req.body;

      if (req.method !== "GET" && (!data || Object.keys(data).length === 0)) {
        throw {
          details: [],
          message: "Request body is empty",
          status: 422
        };
      }

      await rules.validateAsync(data, { abortEarly: false,stripUnknown:true });
      next();
    } catch (exception) {
      // console.log("Joi validation error:", exception);
      let msgBag = {};
      if (exception.details) {
        exception.details.forEach((error) => {
          const path = error.path.join(".");
          msgBag[path] = error.message;
        });
      }

      next({
        code: 400,
        detail: msgBag,
        message: "Validation failed",
        status: exception.status || "VALIDATION_FAILED"
      });
    }
  };
};

module.exports = bodyValidator;
