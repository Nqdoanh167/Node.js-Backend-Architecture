'use strict';
const keyTokenModel = require('../models/keytoken.model');
const {
  Types: { ObjectId },
} = require('mongoose');
class KeyTokenService {
  static async createKeyToken({ userId, publicKey, refreshToken ,refreshTokensUsed}) {
    try {
      // level 0
      // const publicKeyString = publicKey.toString();
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });
      // return tokens ? tokens.publicKey : null

      //level xxx
      const filter = {
        user: userId,
      };
      const update = {
        user: userId,
        publicKey,
        refreshToken,
        $addToSet:{
          refreshTokensUsed: refreshTokensUsed
        }
      };
      const options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static async findByUserId(userId) {
    return await keyTokenModel.findOne({ user: new ObjectId(userId) }).lean();
  }

  static async removeKeyById(id) {
    return await keyTokenModel.deleteOne({ _id: id }).lean();
  }

  static async findByRefreshTokenUsed(refreshToken) {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  }

  static async findByRefreshToken(refreshToken) {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  }

  static async deleteKeyByUserId(userId){
    return await keyTokenModel.deleteOne({user: userId}).lean()
  }
}

module.exports = KeyTokenService;
