var fs = require('fs');
var _ = require('lodash');

var generateProperties = function(template) {
  _.forIn(template, function(value, key) {
    if (!template[key].hasOwnProperty('min')) {
      return;
    }
    template[key].value = getRandomIntInclusive(template[key].min, template[key].max);
  });

  return template;
};

var generateStar = function() {
  var file = JSON.parse(fs.readFileSync('conf/stars.conf.json', 'utf8'));
  var template = lottery(file);
  return generateProperties(template);
}


var generateSolarSystem = function(nbrPlanets) {
  var star = generateStar();
  var planet = generatePlanet(star);
};

var generatePlanet = function(star) {
  var planet = JSON.parse(fs.readFileSync('conf/planets.conf.json', 'utf8'));
  var starMass = star.mass.value;

  // Planet mass (ratio)
  planet.mass = getRandomIntInclusive(0.0000000001, 0.05) * starMass;
  planet.structure.radius.value = getRandomIntInclusive(planet.structure.radius.min, planet.structure.radius.max);
  var layersAfterLottery = [];
  _.forEach(planet.layers, function(layer) {
    var result = lottery([layer]);
    if (result) {
      layersAfterLottery.push(result);
    }
  })
  layersAfterLottery = generateProperties(layersAfterLottery);
  planet.layers = layersAfterLottery;

  return planet;
}

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

  if (totalRates < 1) {
    var emptyElement = {
      type: null,
      spawn_rate: 1 - totalRates
    };
    list.push(emptyElement);
  }

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
  return (result.type === null) ? null : result;

};

var newStar = generateStar();
console.log(newStar);