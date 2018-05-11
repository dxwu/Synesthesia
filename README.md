# Synesthesia 

A colorful visual display driven by digital piano input.

# Running locally

Download Node and NPM

$ npm install
$ node app.js

Connect your MIDI input device to your computer
In Chrome on that computer, go to 'http://localhost:3000'

# Ideas and directions

1. Shows different colors based on the individual keys you press. The highest pitch pressed changes the color of 1 item (in the last 50ms to ignore trills).
2. Shows different colors based on chords you play. Algorithm to parse chords would have to take into account most recently played 2-4 notes.

## Browser Visualization

http://localhost/keys 

Creates a minimalitic browser based visualization of a keyboard (notes are represented like lines). Each note you play is displayed on the on-screen keyboard. The colors of the keys played are based on the colors of Scriabin's colored piano. See https://en.wikipedia.org/wiki/Clavier_%C3%A0_lumi%C3%A8res and https://sound.io/midi/ (for visualization).