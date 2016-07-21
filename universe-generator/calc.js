var _ = require('lodash');
// Calc module
module.exports = {

  /**
   * Calc a volume
   * @param  {Float} density    Density in g/m3
   * @param  {Float} mass       Mass in kg
   * @return {Float}            Volume in m3
   */
  volume: function(density, mass) {
    return density * (mass * 1000);
  }
};
