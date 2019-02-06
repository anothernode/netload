#!/usr/bin/env node

const sysinf = require('systeminformation');
const blessed = require('blessed');
const blessedContrib = require('blessed-contrib');

let term = require('terminal-kit').terminal;
let screen = blessed.screen();

let grid = new blessedContrib.grid({ rows: 1, cols: 1, screen: screen });

let netloadBar = grid.set(0, 0, 1, 1, blessedContrib.netloadBar, {
    label: "netload",
    barWidth: 0.5,
    barSpacing: 1,
    xOffset: 1,
    maxHeight: 3,
    showText: false,
});

var box = blessed.box({
    bottom: 0,
    right: 0,
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

let data = [];
let rx_sec;
let tx_sec;

updateScreen();
setInterval(updateScreen, 1000);

function updateScreen() {

    let innerWidth = term.width - 3;
    if (data.length < innerWidth) {
        let fillUp = innerWidth - data.length;
        for (let i = 0; i < fillUp; i++) {
            data.push(0);
        }
    }
    if (rx_sec >= 0) {
        data.push(rx_sec);
    }
    if (data.length > innerWidth) {
        data.shift();
    }

    netloadBar.setData({ data: data });

    sysinf.networkStats().then(data => {
        rx_sec = (data.rx_sec / 1024).toFixed(2);
        tx_sec = (data.tx_sec / 1024).toFixed(2);
        box.setContent(
            " RX: {bold}" + rx_sec + "{/bold} \n" +
            " TX: {bold}" + tx_sec + "{/bold} ");
    });

    screen.render();
}

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

screen.on('resize', function () {
    netloadBar.emit('attach');
})
