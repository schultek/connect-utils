const platform = require('connect-platform');

const { publish } = require("../lib/pubsub-redis")

/**
 * Concept node for event emitters and listeners.
 */
platform.core.node({
    path: '/connect-utils/emit',
    public: false,
    method: 'GET',
    inputs: ['channel', 'data'],
    outputs: [],
    controlOutputs: ['emitted'],
    hints: {
      node: 'emits the given data to an event channel',
      inputs: {
        channel: 'the event channel to emit to',
        data: 'the data to emit'
      },
      outputs: {},
      controlOutputs: {
        emitted: "the event was emitted successfully"
      }
    }
  },
  async (inputs, output, control, error) => {
    publish(inputs.channel, inputs.data)
      .then(() => control("emitted"))
      .catch((err) => error(err))
  }
);