module.exports = {
  STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
  },
  SKIP_AUTHORIZATION: ["/user/create", "/user/login"],
  MODALS: {
    USER: { NAME: "user" },
    BRAND: { NAME: "brand" },
    TYPE: { NAME: "type" },
    MODEL: { NAME: "model" },
    VEHICLE: { NAME: "vehicle" },
    JOB: { NAME: "job" },
    QUOTATION: { NAME: "quotation" },
    SUPPLIER: { NAME: "supplier" },
    INVENTORY: { NAME: "inventory" }
  }
};
