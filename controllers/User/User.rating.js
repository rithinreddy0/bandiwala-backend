const Order = require('../../models/Order');
const Review = require('../../models/Review'); // Adjust the path as needed
const Vendor = require('../../models/Vendor'); // Adjust the path as needed

exports.addReview = async (req, res) => {
    try {
        const { orderId } = req.body; // Assuming vendorId is passed in the URL
        const { rating, comment } = req.body;
        const userId = req.user._id;
        
        // Check if a review has already been added for this order
        const review1 = await Review.findOne({ orderId });
        if (review1) {
            return res.status(450).json({
                rating: review1.rating,
                message: "Already added"
            });
        }
        
        const data = await Order.findOne({ _id: orderId });
        const vendorId = data.vendorId;
        
        // Input validation
        console.log(req.body);
        if (!orderId || !rating) {
            return res.status(400).json({
                message: "Order ID and rating are required."
            });
        }
        
        console.log(data);
        
        // Create a new review
        const review = new Review({
            vendorId,
            userId,
            rating,
            comment,
            orderId
        });

        // Save the review
        await review.save();

        // Fetch all reviews for the vendor to calculate the average rating
        const reviews = await Review.find({ vendorId });

        // Calculate the new average rating and round it to one decimal place
        const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = (totalRatings / reviews.length).toFixed(1); // Round to one decimal place

        // Update the vendor's average rating
        await Vendor.findByIdAndUpdate(vendorId, { averageRating: parseFloat(averageRating) }, { new: true });

        res.status(201).json({
            message: "Review added successfully.",
            review
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
