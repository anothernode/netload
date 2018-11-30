#!/usr/bin/env node

let blessed = require('blessed');
let blessedContrib = require('blessed-contrib');
let screen = blessed.screen();

let sparkline = blessedContrib.sparkline({
    label: 'netload',
    tags: true,
    style: { fg: 'red' }
});
screen.append(sparkline);
sparkline.setData(
    [ 'Sparkline1', 'Sparkline2'],
    [
        [10, 20, 30, 20],
        [40, 10, 40, 50]
    ]
);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

screen.render();
