#!/usr/bin/env node

let blessed = require('blessed');
let blessedContrib = require('blessed-contrib');
let screen = blessed.screen();

let netloadBar = blessedContrib.netloadBar({
    barWidth: 3,
    barSpacing: 5,
    xOffset: 0,
    maxHeight: 3
});

screen.append(netloadBar);

let titles = [];
for (let i = 0; i < 10; i++) {
    titles.push(' ');
}
function updateData() {
    let data = [];
    for (let i = 0; i < titles.length; i++) {
        data.push(Math.round(Math.random() * 10))
    }
    netloadBar.setData({titles: titles, data: data});
    screen.render();
}
updateData();
setInterval(updateData, 1000);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});
