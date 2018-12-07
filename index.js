#!/usr/bin/env node

let blessed = require('blessed');
let blessedContrib = require('blessed-contrib');
let screen = blessed.screen();

let term = require('terminal-kit').terminal;

let grid = new blessedContrib.grid({ rows: 1, cols: 1, screen: screen });

let netloadBar = grid.set(0, 0, 1, 1, blessedContrib.netloadBar, {
    label: "netload",
    barWidth: 1,
    barSpacing: 2,
    xOffset: 1,
    maxHeight: 3,
    showText: false,
});

screen.append(netloadBar);

let titles = [];
for (let i = 0; i < term.width; i++) {
    titles.push(' ');
}

function updateData() {
    let data = [];
    for (let i = 0; i < titles.length; i++) {
        data.push(Math.round(Math.random() * 9))
    }
    netloadBar.setData({ titles: titles, data: data });
    screen.render();
}
updateData();
setInterval(updateData, 1000);

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

screen.on('resize', function () {
    netloadBar.emit('attach');
})
