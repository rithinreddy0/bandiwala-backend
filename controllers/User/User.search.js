const MenuItem = require('../../models/MenuItem'); // Adjust the path as needed

exports.searchMenuItems = async (req, res) => {
    try {
        const { query } = req.query;

        // Input validation
        if (!query) {
            return res.status(400).json({
                message: "Search query is required."
            });
        }
        // Search for menu items that match the query
        const suggestions = await MenuItem.find({
            name: { $regex: query, $options: 'i' } // Case-insensitive search
        }).limit(10); // Limit to 10 suggestions

        res.status(200).json({
            message: "Search suggestions retrieved successfully.",
            suggestions
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
