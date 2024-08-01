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


const obj={
  product_type:"Clothing",
  product_attributes:{
      brand:"Levis",
      size:"S",
      material:{
        check:'hehe'
      }
  }
}

const newObj={
  product_type:"Clothings",
  product_attributes:{
      // brand:"Levis",
    //  size:"S",
      material:{
        check:"hoho"
      }
  }
}
console.log(updateNestedObjectParser(obj,newObj))