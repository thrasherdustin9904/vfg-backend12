const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({ productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'}, productName:String, productPrice:Number, quantity:{type:Number,default:1}, customerEmail:String, stripeSessionId:String, status:{type:String,default:'paid'} },{timestamps:true});
module.exports = mongoose.model('Order', OrderSchema);
