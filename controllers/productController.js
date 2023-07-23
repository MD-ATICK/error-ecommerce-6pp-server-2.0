
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const apiFeatures = require('../utils/api_Features')



exports.allproduct = async (req, res) => {

    const ProductPage = req.query.limit || 1

    const perPageProductLimit = 4 * ProductPage;

    const allproduct = await productModel.find().limit(perPageProductLimit)

    res.status(200).send({
        length: allproduct.length,
        msg: allproduct
    })


}

exports.AdminAllProducts = async (req, res) => {

    const Products = await productModel.find();
    // console.log(Products);

    res.send({
        length: Products.length,
        Products,
    })


}


// GET ' /product ' CONTROLLER
exports.ProductsGet = async (req, res, next) => {
    try {
        const query = req.query

        const ApiFeatures = new apiFeatures(productModel.find(), query) // perameter
            .search()
            .filter()
        // .pagination() // pagination ar jonno page=1&limit=10 tay 10 products dekacce lagle aber uncommmed krbo.

        const products = await ApiFeatures.productData
        const productALL = await productModel.find()

        res.status(200).json({
            success: true,
            LengthAll: productALL.length,
            productno: products.length || 0,
            message: 'finded all product successfully',
            data: products,
        })
        next()

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}


// POST  ' /product/new '  CONTROLLER
exports.ProductsCreate = async (req, res, next) => {
    try {
        req.body.user = req.user._id 

        const newproduct = new productModel({
            productname : req.body.productname ,
            description : req.body.description ,
            price : req.body.price ,
            stock : req.body.stock ,
            category : req.body.category ,
            user : req.body.user ,
            images : [{
                url : req.body.avatar
            }]
        })
        const StoreProduct = await newproduct.save()
        res.status(201).json({
            success: true,
            StoreProduct,
        })
        next();

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}


// PUT ' /product/:id ' CONTROLLER
exports.ProductsUpdate = async (req, res, next) => {

    try {
        const paramsId = req.params.id
        const product = await productModel.findById(paramsId)

        if (!product) {
            return res.status(500).send({
                success: false,
                message: 'product not found for update '
            })
        }

        const updateProduct = await productModel.findByIdAndUpdate(paramsId, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
        res.status(200).json({
            success: true,
            message: 'Updated successfully',
            data: updateProduct
        })
        next()
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}


// DELETE ' /product/:id ' route
exports.ProductDelete = async (req, res, next) => {

    try {
        const paramsId = req.params.id
        // console.log(paramsId)
        const product = await productModel.findById(paramsId)

        if (!product) {
            return res.status(500).send({
                success: false,
                message: 'product not found for update '
            })
        }

        const DeletedProduct = await productModel.findByIdAndDelete(paramsId)
        res.status(200).json({
            success: true,
            DeletedProduct,
        })
        next()
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}


// // DETAILS BY ' /product/:id ' route 
exports.ProductDetails = async (req, res, next) => {

    try {
        const paramsId = req.params.id
        const product = await productModel.findById(paramsId)
        if (!product) {
            return res.send({
                success: false,
                message: 'product not found for update '
            })
        }
        res.send({
            success: true,
            data: product
        })
        next()

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }

}


// User Product Review
exports.createProductReview = async (req, res) => {

    const { rating, comment, id } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
        image: req.user.avatar.url || '/user.png'
    }
    // console.log(req.user);
    const product = await productModel.findById(id)
    let average = 0
    const alreadyReview = await product.reviews.find((review) => review.user.toString() === req.user._id.toString())
    // console.log(alreadyReview)
    if (alreadyReview) {
        product.reviews.map((reviewSingle) => {
            if (reviewSingle.user.toString() === req.user._id.toString()) {
                // console.log(reviewSingle.rating)
                reviewSingle.rating = rating,
                    reviewSingle.comment = comment
                product.reviews.map((review) => {
                    average += review.rating
                })
                return product.ratings = average / product.reviews.length
            }
        })
        await product.save({ validateBeforeSave: false })
        return res.send(product)
    }

    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
    product.reviews.map((review) => {
        average += review.rating
    })
    product.ratings = average / product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.send({
        success: true,
        review: product,
    })
}


//  all reviews 
exports.getAllreviews = async (req, res) => {

    try {
        const product = await productModel.findById(req.query.id)
    
        if (!product) {
            return res.send(`${req.query.id} product not found`)
        }
    
        res.status(200).send({
            success: true,
            lengthOfreviews: product.reviews.length,
            reviews: product.reviews,
        })
        
    } catch (error) {
        res.send({
            success : false ,
            error : 'Product Id Roung Try Again'} )
    }


}


// delete reviews
exports.deleteReviews = async (req, res) => {

    const product = await productModel.findById(req.query.productId)

    if (!product) {
        return res.send({ msg: 'review not found' })
    }

    const reviews = product.reviews.filter((reviews) => reviews._id.toString() !== req.query.id.toString())

    let avg = 0

    reviews.map((item) => {
        avg += item.rating
    })

    const ratings = avg / reviews.length

    const numOfReviews = reviews.length

    await productModel.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, { new: true, runValidators: true, useFindAndModify: false })

    res.status(200).send({
        msg: "delete successful",
        review: reviews
    })
}

