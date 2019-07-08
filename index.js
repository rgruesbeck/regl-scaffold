// Regl Batch example

import convert from 'color-convert';
import Koji from 'koji-tools';
import Regl from 'regl';

// As usual, we start by creating a full screen regl object
const regl = Regl();

// Run the koji-tools pageLoad function
Koji.pageLoad();
const config = Koji.config;
Koji.on('change', (scope, key, value) => {
  config[scope][key] = value;
});


// Color getter
const getColor = (key) => {
    return [
        ...convert.hex.rgb(config.colors[key])
        .map(c => c / 255),
        1
    ];
};

// Next we create our command
const draw = regl({
  frag: `
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,

  vert: `
    precision mediump float;
    attribute vec2 position;
    uniform float angle;
    uniform vec2 offset;
    void main() {
      gl_Position = vec4(
        cos(angle) * position.x + sin(angle) * position.y + offset.x,
        -sin(angle) * position.x + cos(angle) * position.y + offset.y, 0, 1);
    }`,

  attributes: {
    position: [
      0.5, 0,
      0, 0.5,
      1, 1]
  },

  uniforms: {
    // the batchId parameter gives the index of the command
    color: getColor('primaryColor'),
    angle: ({tick}) => 0.01 * tick,
    offset: regl.prop('offset')
  },

  depth: {
    enable: false
  },

  count: 3
})

// Here we register a per-frame callback to draw the whole scene
regl.frame(function () {
  regl.clear({
    color: getColor('backgroundColor')
  })

  // This tells regl to execute the command once for each object
  draw([
    { offset: [-1, -1] },
    { offset: [-1, 0] },
    { offset: [-1, 1] },
    { offset: [0, -1] },
    { offset: [0, 0] },
    { offset: [0, 1] },
    { offset: [1, -1] },
    { offset: [1, 0] },
    { offset: [1, 1] }
  ])
})