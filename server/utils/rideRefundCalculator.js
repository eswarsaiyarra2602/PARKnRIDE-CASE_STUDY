
const rideRefundCalculator = async (totalFare, pickupTime) => {
    const pickupDate = new Date(pickupTime);
    const currentDate = new Date();
    const diffInMinutes = Math.round((currentDate - pickupDate) / 60000); // Difference in minutes
    
    // Calculate refund based on time of cancellation
    if (diffInMinutes > 30) {
        return totalFare * 0.75; // 75% refund if cancelled after 30 minutes
    } else {
        return totalFare * 0.9; // 90% refund if cancelled within 30 minutes
    }
};

module.exports = rideRefundCalculator;