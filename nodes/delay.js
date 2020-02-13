const platform = require('connect-platform');

/**
 * Delays the execution of the next node.
 */
platform.core.node({
    path: '/connect-utils/delay',
    public: false,
    method: 'GET',
    inputs: ['seconds'],
    outputs: [],
    controlOutputs: ['continue'],
    hints: {
      node: 'delays the execution by firing the continue output after the specified amount of seconds',
      inputs: {
        seconds: 'the delay in seconds'
      },
      outputs: {},
      controlOutputs: {
        continue: 'when the execution should continue'
      }
    }
  },
  (inputs, output, control) => {

    setTimeout(() => control("continue"), inputs.seconds*1000)

  }
);