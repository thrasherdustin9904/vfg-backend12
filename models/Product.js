const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({ name:{type:String,required:true}, description:String, price:{type:Number,required:true}, image:String, thumb:String },{timestamps:true});
module.exports = mongoose.model('Product', ProductSchema);
