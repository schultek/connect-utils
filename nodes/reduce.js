const platform = require('connect-platform');

/**
 * Performs a reduce operation for a node over a target. 
 * The node awaits each execution before continuing.
 */
platform.core.node({
    path: '/connect-utils/reduce',
    public: false,
    method: 'GET',
    inputs: ['array', 'initial', 'path'],
    outputs: ['result'],
    controlOutputs: ['non_existent_path'],
    hints: {
      node: 'applies reduces to a target',
      inputs: {
        array: 'the array to apply reduce on',
        initial: 'the initial value',
        path: 'the path of the reducer node'
      },
      outputs: {
        result: 'result of the reduce operation'
      },
      controlOutputs: {
        non_existent_path: "the given path does not exist"
      }
    }
  },
  async (inputs, output, control, error, context) => {

    if (!platform.core.registry.registered(inputs.path)) {
      control("non_existent_path")
      return;
    }

    let signature = platform.core.registry.signature(inputs.path)
    let accumulator = inputs.initial;

    for (let i = 0; i <  inputs.array.length; i++) {

      let params = {i, index: i, length: inputs.array.length, item: inputs.array[i], array: inputs.array, acc: accumulator, accumulator}
      for (let input of signature.inputs) {
        if (!(input in params))
        params[input] = undefined;
      }

      accumulator = await platform.core.callable(() => platform.core.registry.instance(inputs.path), context)(params)
        .then(result => result.data)
    }

    output("result", accumulator)

  }
);