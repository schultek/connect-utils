const platform = require('connect-platform');

/**
 * Performs a filter operation for a node over an array. The node starts all executions simultaneously 
 * and waits until all have finished before returning the results array.
 */
platform.core.node({
    path: '/connect-utils/filter',
    public: false,
    method: 'GET',
    inputs: ['array', 'path'],
    outputs: ['results'],
    controlOutputs: ['non_existent_path'],
    hints: {
      node: 'filters an array',
      inputs: {
        array: 'the array to filter',
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
    let callable = platform.core.callable(() => platform.core.registry.instance(inputs.path), context);
    let promises = [];

    for (let i = 0; i < inputs.array.length; i++) {

      let params = {i, index: i, length: inputs.array.length, item: inputs.array[i], array: inputs.array}
      for (let input of signature.inputs) {
        if (!(input in params))
        params[input] = undefined;
      }

      promises.push(callable(params).then(result => result.data))
    }

    Promise.all(promises).then(results => output("results", inputs.array.filter((_, i) => !!results[i])))

  }
);