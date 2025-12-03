/**
 * Create useful MongoDB indexes for VF Gaming
 * Usage: node scripts/create_indexes.js
 */
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vfgaming';
async function run(){
  await mongoose.connect(MONGODB_URI);
  console.log('Connected');
  await mongoose.connection.db.collection('products').createIndex({ name: 'text', description: 'text' });
  await mongoose.connection.db.collection('products').createIndex({ price: 1 });
  console.log('Indexes created');
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
