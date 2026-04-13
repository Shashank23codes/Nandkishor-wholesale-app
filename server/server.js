import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import db from './db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Storage Logic
const storagePath = process.env.DATA_STORAGE_PATH;
const posterStoragePath = process.env.POSTER_STORAGE_PATH;
const appDataDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');
const defaultPath = path.join(appDataDir, 'nandkishor-wholesale');

const baseDir = (storagePath && fs.existsSync(storagePath)) ? storagePath : defaultPath;
const imagesDir = path.join(baseDir, 'images');

// Posters directory - if custom path exists, use it, else put it inside baseDir
const postersDir = (posterStoragePath && fs.existsSync(posterStoragePath)) 
  ? posterStoragePath 
  : path.join(baseDir, 'posters');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(postersDir)) fs.mkdirSync(postersDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' })); 
app.use('/images', express.static(imagesDir));
app.use('/posters', express.static(postersDir)); // Serve posters as well

// Helper: Save Base64 to file
const saveImage = (base64Data, filename, customDir = null) => {
  if (!base64Data || !base64Data.startsWith('data:image')) return base64Data;
  
  try {
    const targetDir = customDir || imagesDir;
    const parts = base64Data.split(';base64,');
    if (parts.length < 2) return base64Data;
    
    const extension = base64Data.split(';')[0].split('/')[1];
    const base64Image = parts.pop();
    const newFilename = `${filename}_${Date.now()}.${extension}`;
    const filePath = path.join(targetDir, newFilename);
    
    fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });
    
    // If it's the imagesDir, return the local URL. 
    // If it's a custom posters dir, we just return the path for confirmation.
    if (targetDir === imagesDir) {
      return `http://localhost:${PORT}/images/${newFilename}`;
    }
    return filePath;
  } catch (err) {
    console.error('Error saving image:', err);
    return base64Data;
  }
};

// Helper: Format SQLite response for React
const formatProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    _id: p._id || p.id,
    colors: p.colors ? JSON.parse(p.colors) : [],
    sizePricings: p.sizePricings ? JSON.parse(p.sizePricings) : [],
    images: p.images ? JSON.parse(p.images) : []
  };
};

// API Routes

// 1. Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
    res.json(products.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Create a product
app.post('/api/products', (req, res) => {
  try {
    const { name, category, subcategory, customCode, gender, fabric, colors, sizePricings, images } = req.body;
    
    const lastProduct = db.prepare('SELECT autoId FROM products ORDER BY id DESC LIMIT 1').get();
    let nextNum = 1;
    if (lastProduct && lastProduct.autoId) {
      const match = lastProduct.autoId.match(/NK-(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const autoId = `NK-${String(nextNum).padStart(4, '0')}`;
    const _id = crypto.randomUUID();

    const processedImages = (images || []).map((img, idx) => ({
      ...img,
      src: saveImage(img.src, `prod_${autoId}_${idx}`)
    }));

    const stmt = db.prepare(`
      INSERT INTO products (_id, name, category, subcategory, autoId, customCode, gender, fabric, colors, sizePricings, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      _id, name, category, subcategory, autoId, customCode, gender, fabric,
      JSON.stringify(colors || []),
      JSON.stringify(sizePricings || []),
      JSON.stringify(processedImages)
    );

    const savedProduct = db.prepare('SELECT * FROM products WHERE _id = ?').get(_id);
    res.status(201).json(formatProduct(savedProduct));
  } catch (err) {
    console.error('❌ Server POST error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// 3. Update a product
app.put('/api/products/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { name, category, subcategory, customCode, gender, fabric, colors, sizePricings, images } = req.body;

    const processedImages = (images || []).map((img, idx) => ({
      ...img,
      src: (img.src && img.src.startsWith('data:image')) 
        ? saveImage(img.src, `prod_upd_${id}_${idx}`)
        : img.src
    }));

    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, category = ?, subcategory = ?, customCode = ?, gender = ?, fabric = ?, 
          colors = ?, sizePricings = ?, images = ?
      WHERE _id = ? OR id = ?
    `);

    stmt.run(
      name, category, subcategory, customCode, gender, fabric,
      JSON.stringify(colors || []),
      JSON.stringify(sizePricings || []),
      JSON.stringify(processedImages),
      id, id
    );

    const updated = db.prepare('SELECT * FROM products WHERE _id = ? OR id = ?').get(id, id);
    res.json(formatProduct(updated));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM products WHERE _id = ? OR id = ?').run(id, id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Save a generated poster
app.post('/api/save-poster', (req, res) => {
  try {
    const { image, filename } = req.body;
    const finalPath = saveImage(image, filename || 'poster', postersDir);
    res.json({ success: true, path: finalPath });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Offline Server running on http://localhost:${PORT}`);
});
