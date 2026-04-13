import mongoose from 'mongoose';

const sizePricingSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  subcategory: { type: String },
  autoId: { type: String, unique: true },
  customCode: { type: String },
  gender: { type: String },
  fabric: { type: String },
  colors: [{
    name: String,
    hex: String
  }],
  sizePricings: [sizePricingSchema],
  images: [{
    src: String,
    name: String
  }],
  createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model('Product', productSchema);
