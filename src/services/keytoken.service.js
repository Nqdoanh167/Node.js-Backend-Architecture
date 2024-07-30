'use strict';
const keyTokenModel = require('../models/keytoken.model');
const { Types: { ObjectId } } = require('mongoose')
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
    try {
      // level 0
      // const publicKeyString = publicKey.toString();
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });
      // return tokens ? tokens.publicKey : null

      //level xxx
      const publicKeyString = publicKey.toString();
      const filter = {
        user: userId,
      };
      const update = {
        user: userId,
        publicKey:publicKeyString,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static async findByUserId(userId) {
    return await keyTokenModel.findOne({user: new ObjectId(userId)}).lean();
  }

  static async removeKeyById(id){
    return await keyTokenModel.deleteOne({_id:id})
  }
}

module.exports = KeyTokenService;
