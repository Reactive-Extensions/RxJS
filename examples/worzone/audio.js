(function (Game) {
  function Audio () {
    var on = false,
    sounds = {};

    function loadSound(soundName) {
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', 'audio/' + soundName + '.ogg');
      return audioElement;
    }

    function getSound(soundName) {
      sounds[soundName] || (sounds[soundName] = loadSound(soundName));
      return sounds[soundName];
    }

    function play(soundName) {
      on && getSound(soundName).play();
    }

    return {
      playSound : function(soundName) { return function() { play(soundName) }},
      toggle : function() { on = !on; }
    };
  }

  Game.Audio = Audio;
}(window.Game));
