var fs = require('fs');
var _ = require('lodash');

var generateSolarSystem = function(size) {
  var grid = 100;
  var celestialsPlanets = 10;
  var sunCelestialSize = 3;
  var celestialsPlanetsSizeMax = 0.10 * sunCelestialSize;
  var celestialsPlanetsSizeMin = 0.02 * sunCelestialSize;
  var planetSpacingMin = 8;
};

var generateStar = function(file) {
  var file = JSON.parse(fs.readFileSync(file, 'utf8'));
  var starTemplate = lottery(file);
  _.forIn(starTemplate, function(value, key) {
    if (!starTemplate[key].hasOwnProperty('min')) {
      return;
    }
    starTemplate[key].value = getRandomIntInclusive(starTemplate[key].min, starTemplate[key].max);
  });

  return starTemplate;
};

var getRandomIntInclusive = function(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
}

var lottery = function(list) {
  var totalRates, choices, randomRate, result;

  /**
   * Rates is the spawn_rate sum of each element of the lottery
   */
  totalRates = _.sum(list, function(item) {
    return item.spawn_rate;
  });
  totalRates = totalRates;

  /**
   * We defined the generale percentage of chance for each
   * element to be selected
   */
  choices = _.sortByOrder(_.map(list, function(element) {
    return {
      item: element,
      rate: (element.spawn_rate/ totalRates) * 100
    };
  }), 'rate', 'asc');

  var start = 0;
  choices = _.forEach(choices, function(element) {
    element.minRate =  Math.round(start) + 1;
    element.maxRate = Math.round(start + element.rate);
    start += element.rate;
  });

  /**
   * We launch the lottery (between 1 and 100)
   */
  randomRate = Math.random() * 100;
  _.forEach(choices, function(element){
    if(randomRate <= element.maxRate) {
      result = element.item;
      return false;
    }
  });
  return result;

};

var newStar = generateStar('conf/stars.conf.json');
console.log(newStar);