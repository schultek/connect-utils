const platform = require('connect-platform');

/**
 * Repeats a node several times. The node starts all executions simultaneously 
 * and waits until all have finished before returning the results array.
 */
platform.core.node({
    path: '/connect-utils/repeat',
    public: false,
    method: 'GET',
    inputs: ['n', 'path'],
    outputs: ['results'],
    controlOutputs: ['non_existent_path'],
    hints: {
      node: 'repeats a node several times',
      inputs: {
        n: 'the number of repetitions',
        path: 'the path of the node'
      },
      outputs: {
        results: 'array of the results once all executions are completed'
      },
      controlOutputs: {
        non_existent_path: "the given path does not exist"
      }
    }
  },
  (inputs, output, control, error, context) => {

    if (!platform.core.registry.registered(inputs.path)) {
      control("non_existent_path")
      return;
    }

    let signature = platform.core.registry.signature(inputs.path)
    let promises = [];

    for (let i = 0; i < inputs.n; i++) {

      let params = {i, index: i, length: inputs.n}
      for (let input of signature.inputs) {
        if (!(input in params))
        params[input] = undefined;
      }

      promises.push(platform.core.callable(() => platform.core.registry.instance(inputs.path), context)(params).then(result => result.data))
    }

    Promise.all(promises).then(results => output("results", results))

  }
);