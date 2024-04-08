const jwt = require('jsonwebtoken');

/**
 *
 * @param {String} token
 * @returns {Object}
 */
export const validate = function(token) {
  const { JWT_SECRET } = process.env;
  const data = jwt.verify(token, JWT_SECRET);
  return data;
};
