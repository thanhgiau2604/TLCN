const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

//user schema
const UserSchema = new Schema({
    id:String,
    email: {type:String,required:true,index:{unique:true}},
    firstName: String,
    lastName: String,
    numberPhone: String,
    dob: String,
    password: {type:String,select:false},
    favoritelist: [{id:Schema.Types.ObjectId}],
    historylist: [{id:Schema.Types.ObjectId,time:Number}],
    cart: [{idProduct: Schema.Types.ObjectId, quanty:Number, size:Number, color: String, status:String}],
    role: String
});
//hash password
UserSchema.pre('save',function(next){
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password,null,null,(err,hash)=>{
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
UserSchema.pre('update',function(next){
    var user = this;
    const password = this.getUpdate().$set.password;
    if (!password) return next();
    bcrypt.hash(password,null,null,(err,hash)=>{
        if (err) return next(err);
        this.getUpdate().$set.password = hash; 
        next();
    });
})
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    console.log(password);
    console.log(user.password);
    return bcrypt.compareSync(password,user.password);
};

module.exports = mongoose.model('User',UserSchema);