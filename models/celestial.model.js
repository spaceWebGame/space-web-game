'use strict';

class Celestial {
  constructor() {
    this.id = null;
    this.name = null;
    this.health = null;
    this.resources = [];
    this.type = null;
    this.description = null;
    this.radius = null;
    this.slots = [];
    this.position = {};
    this.velocity = null;
    this.reference_frame = {};
    this.mass = null;
    this.environment = {};
    this.satellites = [];
    this.surface = null;
  }

  generateCelestial(type) {

    var celestial = new Celestial(params);
    return celestial;
  }
}

