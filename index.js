var audio = new AudioContext();

function createSineWave(audio, duration) {
    var oscillator = audio.createOscillator();
    oscillator.type = "sine";

    oscillator.start(audio.currentTime);
    oscillator.stop(audio.currentTime + duration);
    return oscillator;
}

function rampDown(audio, item, startValue, duration) {
    item.setValueAtTime(startValue, audio.currentTime);
    item.exponentialRampToValueAtTime(0, audio.currentTime + duration);
}   

function createAmlifier(audio, startValue, duration) {
    var amplifier = audio.createGain();
    rampDown(audio, amplifier.gain, startValue, duration);
    return amplifier;
}

function chain(items) {
    for (var i = 0; i < items.length -1; i++) {
        items[i].connect(items[i + 1]);
    }
}

function note(audio, frequency) {
    return function() {
        var duration = 1;
        var sineWave = createSineWave(audio, duration);
        chain([sineWave,
                createAmplifier(audio, 0.2, duration),
                audio.destination]);
        sineWave.connect(audio.destination);
    }
}

var data = {
    step: 0,

}

note(audio, 340)()