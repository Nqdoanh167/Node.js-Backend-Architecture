'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keytoken.service');
const ShopService=require('../services/shop.service')

const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('../services/shop.service');
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static async generateToken(shop) {
    // created privateKey,publicKey
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      publicKeyEncoding: {
        type: 'pkcs1', // public key cryptography standards 1
        format: 'pem',
      },
    });

    const tokens = await createTokenPair(
      { user: shop._id, email: shop.email },
      privateKey,
      publicKey,
    );

    return { publicKey, tokens };
  }

  static async handlerRefreshToken({ keyStore, user, refreshToken }) {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed && keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError('Something wrong happen! Please relogin');
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered');
    }
    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop not registered!');

    const { publicKey, tokens } = await this.generateToken(foundShop);
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey: publicKey,
      refreshToken: tokens.refreshToken,
      refreshTokensUsed: refreshToken,
    });
    return {
      user,
      tokens,
    };
  }
  static async logout(keyStore) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  }
  static async login({ email, password, refreshToken = null }) {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError('Authentication error');
    }

    // 2
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Authentication error');
    }

    // 3 generate token & create privateKey,publicKey
    const { publicKey, tokens } = await this.generateToken(foundShop);
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  }
  static signUp = async ({ name, email, password }) => {
    //step1: check email exists
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registerd!');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const { publicKey, tokens } = await this.generateToken(newShop);
      await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        refreshToken: tokens.refreshToken,
      });
      return {
        shop: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newShop,
        }),
        tokens,
      };
    }
    return null;
  };
}
module.exports = AccessService;
