const calculateFare = (pickup, dropPoint, vehicleType) => {
    // Dummy fare calculation logic as for now
    const distance = Math.floor(Math.random() * 20) + 1; // Random distance between 1 to 20 km
    let ratePerKm;
  
    switch (vehicleType) {
      case 'cab':
        ratePerKm = 15;
        break;
      case 'bike':
        ratePerKm = 8;
        break;
      case 'e-rickshaw':
        ratePerKm = 5;
        break;
      case 'shuttle':
        ratePerKm = 10;
        break;
      default:
        ratePerKm = 10;
    }
  
    return distance * ratePerKm;
  };
  
  module.exports = { calculateFare };