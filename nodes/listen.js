const platform = require('connect-platform');

const { subscribe } = require("../lib/pubsub-redis")

/**
 * Concept node for event emitters and listeners.
 */
platform.core.node({
    path: '/connect-utils/listen',
    public: false,
    method: 'GET',
    inputs: ['channel', 'path'],
    outputs: [],
    controlOutputs: ['listening', 'non_existent_path'],
    hints: {
      node: 'attaches the given node as a listener to an event channel',
      inputs: {
        channel: 'the event channel to listen to',
        path: 'the path of the listener node'
      },
      outputs: {},
      controlOutputs: {
        non_existent_path: "the given path does not exist",
        listening: "the listener was set up successfully"
      }
    }
  },
  async (inputs, output, control, error, context) => {

    if (!platform.core.registry.registered(inputs.path)) {
      control("non_existent_path")
      return;
    }

    let signature = platform.core.registry.signature(inputs.path)
    let callable = platform.core.callable(() => platform.core.registry.instance(inputs.path), context)

    subscribe(inputs.channel, (event) => {

      let params = {event, e: event, message: event}
      
      for (let input of signature.inputs) {
        if (!(input in params))
        params[input] = undefined;
      }
  
      callable(params)
    })
    .then(() => control("listening"))
    .catch(err => error(err))

  }
);