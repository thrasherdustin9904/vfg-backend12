const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const upload = multer({ storage: multer.memoryStorage() });

function authAdmin(req,res,next){ const h=req.headers.authorization; if(!h) return res.status(401).json({ error:'No auth' }); try{ const p=jwt.verify(h.split(' ')[1], process.env.JWT_SECRET||'changeit'); if(['admin','superadmin'].includes(p.role)) { req.admin=p; return next(); } else return res.status(403).json({ error:'Not allowed' }); }catch(e){ return res.status(401).json({ error:'Invalid' }); } }

router.get('/', async (req,res)=>{ const products = await Product.find().lean(); res.json(products); });
router.post('/', authAdmin, upload.single('image'), async (req,res)=>{ const { name, description, price } = req.body; if(!name||!price) return res.status(400).json({ error:'Missing' }); let image='', thumb=''; if(req.file){ const uploadsDir = path.join(__dirname,'..','uploads'); const main = Date.now()+'-main.jpg'; const th = Date.now()+'-thumb.jpg'; await sharp(req.file.buffer).resize(1200).jpeg({quality:80}).toFile(path.join(uploadsDir, main)); await sharp(req.file.buffer).resize(400).jpeg({quality:70}).toFile(path.join(uploadsDir, th)); image='/uploads/'+main; thumb='/uploads/'+th; } const p = await Product.create({ name, description, price: Number(price), image, thumb }); res.json(p); });
router.put('/:id', authAdmin, upload.single('image'), async (req,res)=>{ const p = await Product.findById(req.params.id); if(!p) return res.status(404).json({ error:'Not found' }); const { name, description, price } = req.body; if(name) p.name=name; if(description) p.description=description; if(price) p.price=Number(price); if(req.file){ const uploadsDir = path.join(__dirname,'..','uploads'); const main = Date.now()+'-main.jpg'; const th = Date.now()+'-thumb.jpg'; await sharp(req.file.buffer).resize(1200).jpeg({quality:80}).toFile(path.join(uploadsDir, main)); await sharp(req.file.buffer).resize(400).jpeg({quality:70}).toFile(path.join(uploadsDir, th)); p.image='/uploads/'+main; p.thumb='/uploads/'+th; } await p.save(); res.json(p); });
router.delete('/:id', authAdmin, async (req,res)=>{ const p = await Product.findById(req.params.id); if(!p) return res.status(404).json({ error:'Not found' }); if(p.image && p.image.startsWith('/uploads/')){ const old = path.join(__dirname,'..',p.image); if(fs.existsSync(old)) fs.unlinkSync(old); } await p.remove(); res.json({ ok:true }); });
module.exports = router;
