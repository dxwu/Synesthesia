# Synesthesia 

A colorful visual display driven by digital piano input.

# Running locally

Download Node and NPM. In this directory (/Synesthesia), run

`$ npm install`

`$ node app.js`

You can use the node server machine as the midi input device, or another computer. 

### Using the server as the MIDI input device

Connect your MIDI input device to your computer

Go to 'http://localhost:3000'

### Using another machine as the MIDI input device

Connect your MIDI input device to you machine (computer, phone, etc).

Go to 'http://server_ip_address:3000/'.

You can find the IP address of your server by typing `ipconfig` on the server machine.

# Adding Philips Hue bulbs

More to come soon.
The latency of a v2 bridge connected color bulb is around 70ms.

# Modes

## Browser Visualization

http://localhost:3000/keys 

Creates a minimalitic browser based visualization of a keyboard (notes are represented like lines). Each note you play is displayed on the on-screen keyboard. The colors of the keys played are based on the colors of Scriabin's colored piano. See https://en.wikipedia.org/wiki/Clavier_%C3%A0_lumi%C3%A8res and https://sound.io/midi/.

## Chord Analysis

http://localhost:3000/lights

Shows different colors based on chords you play.

# Ideas and directions

1. Shows different colors based on the individual keys you press. The highest pitch pressed changes the color of 1 item (in the last 50ms to ignore trills).