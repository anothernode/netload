#!/usr/bin/env node

const sysinf = require('systeminformation');
const blessed = require('blessed');
const blessedContrib = require('blessed-contrib');

let term = require('terminal-kit').terminal;
let screen = blessed.screen();

let grid = new blessedContrib.grid({ rows: 1, cols: 1, screen: screen });

let netloadBar = grid.set(0, 0, 1, 1, blessedContrib.netloadBar, {
    label: "netload",
    barWidth: 1,
    barSpacing: 2,
    xOffset: 1,
    maxHeight: 3,
    showText: false,
});

var box = blessed.box({
    bottom: 0,
    left: 0,
    width: 'shrink',
    height: 'shrink',
    content: ' RX: {bold}0{/bold}\n TX: {bold}0{/bold} ',
    tags: true,
    border: {
        type: 'line',
    },
    style: {
        fg: 'white',
        border: {
            fg: 'cyan'
        },
    }
});
screen.append(box);

let rx_sec = 0;
let tx_sec = 0;
setInterval(function() {
    sysinf.networkStats().then(data => {
        rx_sec = (data.rx_sec).toFixed(0);
        tx_sec = (data.tx_sec).toFixed(0);
        box.setContent(
            " RX: {bold}" + rx_sec + "{/bold} \n" +
            " TX: {bold}" + tx_sec + "{/bold} ");
    })
});

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
