'use strict';

class Slot {
  constructor() {
    this.id = null;
    this.name = null;
    this.description = null;
    this.type = null; // master / slave
    this.category = null; // orbital / terrian
    this.resources = [];
    this.surface = null;
    this.state = null; // attacked / free / occupied
  }
}

