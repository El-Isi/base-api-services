import { expressjwt as jwt } from "express-jwt";
require('../../utils/config');
import blacklist from '../blacklist';
import { validate } from "./validate";
import FindOneUserUseCase from "../../users/useCases/users/FindOneUserUseCase";

/**
 *
 * @param {Object} req
 * @returns {String|null}
 * get an access toke from the header
 */
const getTokenFromHeaders = req => {
    const {
        headers: { authorization }
    } = req;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }
    return null;
};

const checkUserStatus = async (payload, token) => {
    const findOneUserUseCase = new FindOneUserUseCase();
    const { id } = validate(token);
    if (!id) return true;
    const user = await findOneUserUseCase.exec({ _id: id });
    if (!user) return true;
    const { active = false } = user;
    if(!active) {
      blacklist.revoke(payload);
      return true;
    } 
    return false;
  }

  const checkTokenAndUserStatus = (req, payload) => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        blacklist.isRevoked(req, payload.payload, async (r, isRevoked) => {
          if (isRevoked) {
            resolve(true);
            return;
          }
  
          const token = getTokenFromHeaders(req);
          const statusUser = await checkUserStatus(payload, token);
          resolve(!!statusUser);
        });
      } catch (error) {
        reject(error);
      }
    });
  };  

const { JWT_SECRET } = process.env;
export const auth = {
    required: jwt({
        secret: JWT_SECRET,
        requestProperty: 'payload',
        isRevoked: checkTokenAndUserStatus,
        getToken: getTokenFromHeaders,
        algorithms: ["HS256"],
    }),
    optional: jwt({
        secret: JWT_SECRET,
        requestProperty: 'payload',
        isRevoked: blacklist.isRevoked,
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
        algorithms: ["HS256"],
    })
};