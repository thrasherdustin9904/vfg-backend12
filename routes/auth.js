const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// seed admin from env
(async function seed(){ try{ const em = process.env.ADMIN_USER; const pw = process.env.ADMIN_PASS; if(em && pw){ const a = await Admin.findOne({ email: em }); if(!a){ const h = await bcrypt.hash(pw,12); await Admin.create({ email: em, passwordHash: h, role: 'superadmin' }); console.log('Seeded superadmin', em); } } }catch(e){console.error(e);} })();

router.post('/register', async (req,res)=>{ const { username, password } = req.body; if(!username||!password) return res.status(400).json({ error:'Missing' }); const ex = await User.findOne({ username }); if(ex) return res.status(400).json({ error:'Exists' }); const h = await bcrypt.hash(password,12); const u = await User.create({ username, passwordHash: h }); const token = jwt.sign({ id:u._id, role:'customer' }, process.env.JWT_SECRET||'changeit'); res.json({ token }); });
router.post('/login', async (req,res)=>{ const { username, password } = req.body; const u = await User.findOne({ username }); if(!u) return res.status(401).json({ error:'Invalid' }); const ok = await bcrypt.compare(password, u.passwordHash); if(!ok) return res.status(401).json({ error:'Invalid' }); const token = jwt.sign({ id:u._id, role:'customer' }, process.env.JWT_SECRET||'changeit'); res.json({ token }); });

router.post('/admin-login', async (req,res)=>{ const { email, password } = req.body; const a = await Admin.findOne({ email }); if(!a) return res.status(401).json({ error:'Invalid' }); const ok = await bcrypt.compare(password, a.passwordHash); if(!ok) return res.status(401).json({ error:'Invalid' }); const token = jwt.sign({ id:a._id, role:a.role, email: a.email }, process.env.JWT_SECRET||'changeit'); res.json({ token, role: a.role }); });

module.exports = router;
