var fs = require('fs');
var _ = require('lodash');

var generateSolarSystem = function(size) {
  var grid = 100;
  var celestialsPlanets = 10;
  var sunCelestialSize = 3;
  var celestialsPlanetsSizeMax = 0.10*sunCelestialSize;
  var celestialsPlanetsSizeMin = 0.02*sunCelestialSize;
  var planetSpacingMin = 8;
};

var generateStar = function(file) {
  var file = JSON.parse(fs.readFileSync(file, 'utf8'));
  return lottery(file);
};

var lottery = function(list) {
  var totalRates, choices, randomRate, result;

  /**
   * Rates is the spawn_rate sum of each element of the lottery
   */
  totalRates = _.sum(list, function(item) {
    return item.spawn_rate;
  });
  totalRates = Math.round(totalRates);

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

  console.log(choices);

  /**
   * We launch the lottery (between 1 and 100)
   */
  randomRate = Math.random() * 100;
  _.forEach(choices, function(element){
    if(randomRate <= element.rate) {
      result = element.item;
      return false;
    }
  });
  return result;

};

  // for(var i = 0; i < list.length; i++){
  //   var spawnRate = list[i].spawn_rate * 100;
  //   rates += spawnRate;
  // }

  // // Loop a second time to calc percentages
  // for(var i = 0; i < list.length; i++){
  //   var spawnRate = list[i].spawn_rate * 100;
  //   var choice = {
  //     element: list[i],
  //     percentage: (spawnRate / rates) * 100
  //   };
  //   choices.push(choice);
  // }

  // var result = Math.random(1,100);

  // return choices;

  // var finalList = [];

  // if (!list) {
  //   throw 'wtf dude';
  //   return;
  // }

  // for(var i = 0; i < list.length; i++){
  //   var spawnRate = list[i].spawn_rate;
  //   var entries = Math.round(spawnRate * 100);
  //   for(var j = 0; j < entries; j++){
  //     finalList.push(list[i]);
  //   }
  // }

  // return finalList;
// };

var test = generateStar('conf/stars.conf.json');
console.log(test);