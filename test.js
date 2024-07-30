class User {
  // thêm thuộc tính name vào class
  name = "Alex";

  static sayHi(shop) {
    console.log(`Hello, ${shop}!`);
  }
  static say(){
    this.sayHi('shophehe');
  }
}
User.say(); // Hello, Alex!