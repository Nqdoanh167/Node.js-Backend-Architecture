const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((sel) => [sel, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((sel) => [sel, 0]));
};

const removeUndefinedObj = (obj) => {
   Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj
};

const removeNestedObjectParser=obj=>{
  if(typeof obj !== 'object' || obj===null){
    return obj
  }
  let final={}
  for (const key in obj) {
    if (obj[key] === null) {
      delete obj[key]
    }
    else{
      final[key] = removeNestedObjectParser(obj[key]);
    }
  }
  return final
}

const updateNestedObjectParser=(obj,newObj)=>{
  if(typeof obj !== 'object' || obj===null){
    return obj
  }
  let final={}
  for (const key in obj) {
    if (newObj[key]) {
      if (typeof newObj[key] !== 'object') final[key] = newObj[key];
      else final[key]= updateNestedObjectParser(obj[key], newObj[key]);
    }
    else {
      final[key]=obj[key]
    }
  }
  return final
}
module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObj,
  removeNestedObjectParser,
  updateNestedObjectParser
};
