const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

function auth(req,res,next){ const h=req.headers.authorization; if(!h) return res.status(401).json({ error:'No auth' }); try{ const p=jwt.verify(h.split(' ')[1], process.env.JWT_SECRET||'changeit'); req.admin=p; next(); }catch(e){ return res.status(401).json({ error:'Invalid token' }); } }
function requireSuper(req,res,next){ if(req.admin.role!=='superadmin') return res.status(403).json({ error:'Not allowed' }); next(); }

router.get('/list', auth, requireSuper, async (req,res)=>{ const admins = await Admin.find().select('-passwordHash').lean(); res.json(admins); });
router.post('/create', auth, requireSuper, async (req,res)=>{ const { email, password, role } = req.body; if(!email||!password) return res.status(400).json({ error:'Missing' }); const ex = await Admin.findOne({ email }); if(ex) return res.status(400).json({ error:'Exists' }); const h = await bcrypt.hash(password,12); await Admin.create({ email, passwordHash: h, role: role||'admin' }); res.json({ ok:true }); });
router.post('/toggle-role/:id', auth, requireSuper, async (req,res)=>{ const a = await Admin.findById(req.params.id); a.role = a.role==='superadmin'?'admin':'superadmin'; await a.save(); res.json({ ok:true }); });
router.delete('/delete/:id', auth, requireSuper, async (req,res)=>{ await Admin.findByIdAndDelete(req.params.id); res.json({ ok:true }); });
router.post('/change-password', auth, async (req,res)=>{ const { oldPassword, newPassword } = req.body; const a = await Admin.findById(req.admin.id); const ok = await bcrypt.compare(oldPassword, a.passwordHash); if(!ok) return res.status(400).json({ error:'Old incorrect' }); a.passwordHash = await bcrypt.hash(newPassword,12); await a.save(); res.json({ ok:true }); });
module.exports = router;
