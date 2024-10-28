const Review = require('../../models/Review'); // Adjust the path as needed
const Vendor = require('../../models/Vendor'); // Adjust the path as needed

exports.addReview = async (req, res) => {
    try {
        const { vendorId } = req.params; // Assuming vendorId is passed in the URL
        const { user, rating, comment } = req.body;
        const userid = user._id;
        // Input validation
        if (!userId || !rating) {
            return res.status(400).json({
                message: "User ID and rating are required."
            });
        }

        // Create a new review
        const review = new Review({
            vendorId,
            userId,
            rating,
            comment
        });

        // Save the review
        await review.save();

        // Fetch all reviews for the vendor to calculate the average rating
        const reviews = await Review.find({ vendorId });

        // Calculate the new average rating
        const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRatings / reviews.length;

        // Update the vendor's average rating
        await Vendor.findByIdAndUpdate(vendorId, { averageRating }, { new: true });

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
