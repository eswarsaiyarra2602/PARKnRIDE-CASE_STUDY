// utils/rewardCoins.js

// Function to generate random number between min and max
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  // Function to calculate reward coins based on the total price
  const rewardCoins = (totalPrice) => {
    let rewardCoins = 0;
  
    if (totalPrice < 500) {
      rewardCoins = getRandomNumber(1, 50);
    } else if (totalPrice >= 500 && totalPrice <= 2000) {
      rewardCoins = getRandomNumber(50, 200);
    } else if (totalPrice > 2000) {
      rewardCoins = getRandomNumber(200, 500);
    }
  
    return rewardCoins;
  };
  
  module.exports = rewardCoins;