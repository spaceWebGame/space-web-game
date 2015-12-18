var fs = require('fs');
var _ = require('lodash');
var Lottery = require('./lottery.js');

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
  var template = Lottery.draw(file);
  return generateProperties(template);
}


var generateSolarSystem = function(nbrPlanets) {
  var star = generateStar();
  var planet = generatePlanet(star);
  console.log(planet);
};

var generatePlanet = function(star) {
  var planet = JSON.parse(fs.readFileSync('conf/planets.conf.json', 'utf8'));
  var starMass = star.mass.value;

  // Planet mass (ratio)
  planet.mass = getRandomIntInclusive(0.0000000001, 0.05) * starMass;
  planet.structure.radius.value = getRandomIntInclusive(planet.structure.radius.min, planet.structure.radius.max);
  var layersAfterLottery = [];
  _.forEach(planet.structure.layers, function(layer) {
    var result = Lottery.draw([layer], true);
    if (result) {
      layersAfterLottery.push(result);
    }
  });
  layersAfterLottery = generateProperties(layersAfterLottery);
  planet.layers = layersAfterLottery;

  return planet;
}

var getRandomIntInclusive = function(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
}

var newElement = generateSolarSystem();
console.log(newElement);