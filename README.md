# Synesthesia 

A colorful visual display driven by digital piano input.

# Running locally

$ node app.js

Then, in a browser, go to 'http://localhost:3000' and start typing on your keyboard

# Ideas and directions

1. Shows different colors based on the individual keys you press. The highest pitch pressed changes the color of 1 item (in the last 50ms to ignore trills).
2. Shows different colors based on chords you play. Algorithm to parse chords would have to take into account most recently played 2-4 notes.
3. Creates a minimalitic browser based visualization of a keyboard (notes are represented like lines). Each note you play is displayed on the on-screen keyboard. The colors of the keys played are based on the colors of Scriabin's colored piano. See https://en.wikipedia.org/wiki/Clavier_%C3%A0_lumi%C3%A8res and https://sound.io/midi/ (for visualization).