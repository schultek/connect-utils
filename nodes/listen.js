const platform = require('connect-platform');

const { subscribe, publish } = require("../lib/pubsub-redis")

/**
 * Concept node for event emitters and listeners.
 */
platform.core.node({
    path: '/connect-utils/listen',
    public: false,
    method: 'GET',
    inputs: ['channel', 'path'],
    outputs: [],
    controlOutputs: ['done', 'non_existent_path'],
    hints: {
      node: 'attaches the given node as a listener to an event channel',
      inputs: {
        channel: 'the event channel to listen to',
        path: 'the path of the listener node'
      },
      outputs: {},
      controlOutputs: {
        non_existent_path: "the given path does not exist",
        done: "the listener was set up successfully"
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

    subscribe(inputs.channel, ({msgId, data}) => {

      let params = {channel: inputs.channel, data}
      
      for (let input of signature.inputs) {
        if (!(input in params))
        params[input] = undefined;
      }
  
      callable(params)
        .then(result => publish(inputs.channel+"#response#"+msgId, {response: result.data}))
        .catch(err => console.log(err))
    })
    .then(() => control("done"))
    .catch(err => error(err))

  }
);