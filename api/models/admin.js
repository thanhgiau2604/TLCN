const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

//user schema
const AdminSchema = new Schema({
    email: {type:String,required:true,index:{unique:true}},
    firstName: String,
    lastName: String,
    numberPhone: String,
    dob: String,
    password: {type:String,select:false},
    address: String
});
//hash password
AdminSchema.pre('save',function(next){
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password,null,null,(err,hash)=>{
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
AdminSchema.pre('update',function(next){
    const password = this.getUpdate().$set.password;
    if (!password) return next();
    bcrypt.hash(password,null,null,(err,hash)=>{
        if (err) return next(err);
        this.getUpdate().$set.password = hash; 
        next();
    });
})
AdminSchema.methods.comparePassword = function(password) {
    var user = this;
    // console.log(password);
    // console.log(user.password);
    return bcrypt.compareSync(password,user.password);
};

module.exports = mongoose.model('admin',AdminSchema);