var fs = require('fs');
var _ = require('lodash');
var Lottery = require('./lottery.js');
var Calc = require('./calc.js');

/**
 * For each key of the object, will recursively generate a value whenever
 * a min and a max keys are specified
 * @param  {object | array} template
 * @return {object | array}
 */
var generateProperties = function(template) {
  switch(true) {
    case _.isArray(template):
      console.log('isArray');
      _.forEach(template, function(item){
        generateProperties(item);
      });
      break;

    case _.isPlainObject(template):
      _.forIn(template, function(value, key) {
        if (template[key].hasOwnProperty('min') && template[key].hasOwnProperty('max')) {
          template[key].value = _.random(template[key].min, template[key].max);
          delete template[key].min;
          delete template[key].max;
        }
        if(_.isPlainObject(template[key]) || _.isArray(template[key])) {
          generateProperties(template[key]);
        }
      });
  }

  return template;
};

/**
 * Generate star object
 * @return {object} (star)
 */
var generateStar = function() {
  var file = JSON.parse(fs.readFileSync('conf/stars.conf.json', 'utf8'));
  var template = Lottery.draw(file);
  return generateProperties(template);
}

/**
 * Generate solar system object
 * @param  {int} nbrPlanets (max planets wanted)
 * @return {object}         (solar system)
 */
var generateSolarSystem = function(nbrPlanets) {
  var star = generateStar();
  var planets = [];

  nbrPlanets = _.random(3, nbrPlanets);
  for(var i = 0; i < nbrPlanets; i++) {
    var newPlanet = generatePlanet(star);
    planets.push(newPlanet);
  }
  return {
    star: star,
    planets: planets
  };
};

/**
 * Generate planet object
 * @param  {object} star (Star reference)
 * @return {object} planet
 */
var generatePlanet = function(star) {
  var
    planetConf = JSON.parse(fs.readFileSync('conf/planets.conf.json', 'utf8')),
    starMass = star.mass.value,
    starRadius = star.radius.value,
    planet = {
      layers: [],
      volume: {}
    };

  // Inject planet mass and radius (ratio)
  planet.mass = planetConf.mass_ratio;

  // Inject planet layers
  _.forEach(planetConf.layers, function(layer) {
    var result = _.cloneDeep(Lottery.draw([layer], true));
    if (result) {
      planet.layers.push(result);
    }
  });

  // Generate values properties
  planet = generateProperties(planet);

  // Update planet mass depending on star mass
  planet.mass.value = planet.mass.value * starMass;
  // planet.volume.value = null;
  // _.forEach(planet.layers, function(layer) {
  //   var layerVolume = Calc.volume(layer.average_density.value, layer.mass.value);
  //   planet.volume.value += layerVolume;
  // });

  return planet;
}

// Test
var newElement = generateSolarSystem(12);
console.log(newElement);
