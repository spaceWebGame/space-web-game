'use strict';

class Resource {
  constructor() {
    this.id = null;
    this.name = null;
    this.description = null;
    this.rareness_coefficient = null;
    this.quantity = null;
    environment_conditions: {
        temperature: {
            min:0,
            max: 0
        },
        pressure: {
            min:0,
            max: 0
        }
    }
  }
}

