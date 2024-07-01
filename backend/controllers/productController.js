import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

const getProductById = asyncHandler(async(req, res)=> {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).json({message: "Product not found"});
    }
    res.json(product);
})

const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, cuisineCategory, category, image } = req.body;
    console.log(req.body);
  
    const product = new Product({
      title,
      price,
      description,
      cuisineCategory,
      category,
      image: image || 'image.jpg', 
    });
  
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  });
  
 

const updateProduct = asyncHandler(async (req, res) => {
    const {title,
        price,
        description,
        ingredients,
        cuisineCategory,
        category,
        image} = req.body;

    const product = await Product.findById(req.params.id);

    if(product){
        product.title = title;
        product.price = price;
        product.description = description;
        product.ingredients = ingredients;
        product.cuisineCategory = cuisineCategory;
        product.category = category;
        product.image = image;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }else{
        res.status(404);
        throw new Error('Product not found');
    }
        
});


const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
      if(product){
        await Product.deleteOne({_id:product._id});
        res.status(200).json({ message: "Product removed" });
      }else{
        console.error('Error deleting product:', error.message);
        res.status(400).json({ message: error.message });
      }
 
});


//create a review

const createProductReview  = asyncHandler(async(req,res)=> {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, review) => review.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  }else{
    res.status(404);
    throw new Error('Product not found');
  }
})


//create a admin reply

const createAdminReply = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  const { id: productId, reviewId } = req.params; 

  const product = await Product.findById(productId);

  if (product) {
    const review = product.reviews.id(reviewId);

    if (review) {
      review.adminReply = reply;
      await product.save();
      res.status(201).json({ message: 'Reply added' });
    } else {
      res.status(404);
      throw new Error('Review not found');
    }
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


export  {getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, createAdminReply};