(function() {
  "use strict";

  //
  // Oscillator ----------------------------------------------------------------------
  //

  function Oscillator(audioCtx) {
    this.audioCtx = audioCtx;

    // Create the oscillator
    this.osc = audioCtx.createOscillator();
    this.osc.type = 'sine';

    // Create output control
    this.gain = audioCtx.createGain();

    // Connect the chain
    this.osc.connect(this.gain);

    // Begin generating a signal
    this.osc.start(0);

    // Set the initial state
    this.stop();
  }

  Oscillator.prototype.play = function(freq) {
    this.osc.frequency.setValueAtTime(freq, 0);
    this.gain.gain.value = 1;
  };

  Oscillator.prototype.stop = function() {
    this.gain.gain.value = 0;
  };

  Oscillator.prototype.connect = function(node) {
    this.gain.connect(node);
  }

  //
  // Mixer ---------------------------------------------------------------------
  //

  function Mixer(audioCtx, ui_element) {
    var self = this;

    this.gain = audioCtx.createGain();
    this.ui_control = ui_element.querySelector('.mixer__control');

    this.ui_control.addEventListener('mousemove', function() {
      self.setValue(self.ui_control.value);
    });
  }

  Mixer.prototype.connect = function(node) {
    this.gain.connect(node);
  }

  Mixer.prototype.setValue = function(gainValue) {
    this.gain.gain.value = gainValue;
  }

  Mixer.prototype.output = function() {
    return this.gain;
  }

  // http://en.wikipedia.org/wiki/Piano_key_frequencies
  var keyMappings = [
    // A
    { keyCode: 65,  pitch: 'C4', freq: 261.626 },
    // S
    { keyCode: 83,  pitch: 'D4', freq: 293.665 },
    // D
    { keyCode: 68,  pitch: 'E4', freq: 329.628 },
    // F
    { keyCode: 70,  pitch: 'F4', freq: 349.228 },
    // G
    { keyCode: 71,  pitch: 'G4', freq: 391.995 },
    // H
    { keyCode: 72,  pitch: 'A4', freq: 440.000 },
    // J
    { keyCode: 74,  pitch: 'B4', freq: 493.883 },
    // K
    { keyCode: 75,  pitch: 'C5', freq: 523.251 },
    // L
    { keyCode: 76,  pitch: 'D5', freq: 587.330 },
    // ;
    { keyCode: 186, pitch: 'E5', freq: 659.255 }
  ].reduce(function(map, item) {
    map[item.keyCode] = item;
    return map;
  }, {});


  //
  // MAIN ----------------------------------------------------------------------
  //

  window.addEventListener('load', function() {

    console.log('On Load.');

    var audioCtx = new AudioContext();
    var oscillator = new Oscillator(audioCtx);
    var mixer = new Mixer(audioCtx, document.querySelector("[data-module='mixer']"));

    oscillator.connect(mixer.output());
    mixer.connect(audioCtx.destination);

    window.addEventListener('keydown', function(event) {
      var key = keyMappings[event.keyCode];
      if (key) {
        console.log(key.pitch);
        oscillator.play(key.freq);
      }
    });

    window.addEventListener('keyup', function(event) {
      oscillator.stop();
    });


  });
})();
