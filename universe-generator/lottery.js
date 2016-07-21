var _ = require('lodash');
// Lottery module
module.exports = {

  /**
   * Will pick one choice among a list of object that contains a spawn_rate property
   * @param  {Array}    list    list of objects
   * @param  {Boolean}  strict  Will activate the possibilty to add an empty element in lottery
   * @return {Object}           Returns either the chosen object or maybe null (only if strict mode is activated)
   */
  draw: function(list, strict) {
    var totalRates, choices, randomRate, result;

    /**
     * Rates is the spawn_rate sum of each element of the lottery
     */
    totalRates = _.sum(list, function(item) {
      return item.spawn_rate;
    });

    if (strict && totalRates < 1) {
      var emptyElement = {
        type: null,
        spawn_rate: 1 - totalRates
      };
      list.push(emptyElement);
      totalRates = 1;
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

  }
}
