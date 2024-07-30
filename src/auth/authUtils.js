'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keytoken.service');

const HEADER={
  API_KEY:'x-api-key',
  AUTHORIZATION:'authorization',
  CLIENT_ID:'x-client-id'
}

const createTokenPair = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        // console.error('error', err);
      } else {
        // console.log(`decode`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('error');
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
  1. check userId missing
  2. get accessToken
  3. verifyToken
  4. check user in bds
  5. check keyStore with this userId?
  6. OK all => return next()
  */
  
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  const keyStore = await  KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');
  
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid UserId');
    }
  } catch (error) {
  }
  req.keyStore = keyStore;
  return next();
  
});
module.exports = { createTokenPair, authentication };
