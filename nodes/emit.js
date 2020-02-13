const platform = require('connect-platform');

const { publish, subscribe } = require("../lib/pubsub-redis")

/**
 * Concept node for event emitters and listeners.
 */
platform.core.node({
    path: '/connect-utils/emit',
    public: false,
    method: 'GET',
    inputs: ['channel', 'data'],
    outputs: ['response'],
    controlOutputs: [],
    hints: {
      node: 'emits the given data to an event channel',
      inputs: {
        channel: 'the event channel to emit to',
        data: 'the data to emit'
      },
      outputs: {
        response: 'the first response from a listener'
      },
      controlOutputs: {}
    }
  },
  async (inputs, output, control, error) => {

    let msgId = randomMsgId();

    let unsub = await subscribe(inputs.channel+"#response#"+msgId, (result) => {
      unsub();
      output("response", result.response)
    })

    publish(inputs.channel, {msgId, data: inputs.data})
      .catch((err) => error(err))
  }
);

function randomMsgId() {
  return Math.round(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)
}