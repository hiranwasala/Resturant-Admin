import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    default: 'admin reply',
  }
},
  {
    timestamps: true,
  })

const productSchema = new mongoose.Schema(
  {
    
    image: {
      type: String,
     
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Appetizers', 'Salads', 'Beverages', 'Desserts', 'Soups', 'Pizza', 'Burger', 'Main dishes', 'Drinks'], 
    },
    cuisineCategory: {
      type: String,
      required: true,
      enum: ['Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Sri Lankan'],
    },
    ingredients: {
      type: [String], 
      
    },
    reviews:[
      reviewSchema
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
