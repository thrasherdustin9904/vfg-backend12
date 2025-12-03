const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({ email:{type:String,unique:true,required:true}, passwordHash:{type:String,required:true}, role:{type:String,enum:['superadmin','admin'],default:'admin'} },{timestamps:true});
module.exports = mongoose.model('Admin', AdminSchema);
