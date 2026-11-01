import {
  inputJSON,
  inputYAML,
  outputJSON_mATCFalse_mDTCTrue_schemaFalse,
  outputYAML_mATCFalse_mDTCTrue_schemaFalse,
  outputYAML_mATCTrue_mDTCFalse_schemaFalse,
  outputJSON_mATCTrue_mDTCFalse_schemaFalse,
  outputYAML_mATCFalse_mDTCTrue_schemaTrue,
  outputJSON_mATCFalse_mDTCTrue_schemaTrue,
  outputYAML_mATCTrue_mDTCFalse_schemaTrue,
  outputJSON_mATCTrue_mDTCFalse_schemaTrue,
} from './fixtures'
import { Optimizer } from '../src'
import { Output } from '../src/Optimizer'

describe('Optimizer', () => {
  it('should produce the correct optimized file with YAML input and `{ moveAllToComponents: false, moveDuplicatesToComponents: true }, disableOptimizationFor: { schema: false } }`.', async () => {
    const optimizer = new Optimizer(inputYAML)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: false,
            moveDuplicatesToComponents: true,
          },
          disableOptimizationFor: {
            schema: false,
          },
        })
        .trim()
    ).toEqual(outputYAML_mATCFalse_mDTCTrue_schemaFalse.trim())
  })

  it('should produce the correct optimized file with JSON input and `{ moveAllToComponents: false, moveDuplicatesToComponents: true }, disableOptimizationFor: { schema: false } }`.', async () => {
    const optimizer = new Optimizer(inputJSON)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: false,
            moveDuplicatesToComponents: true,
          },
          disableOptimizationFor: {
            schema: false,
          },
        })
        .trim()
    ).toEqual(outputYAML_mATCFalse_mDTCTrue_schemaFalse.trim())
  })

  it('should produce the correct JSON output and `{ moveAllToComponents: false, moveDuplicatesToComponents: true }, disableOptimizationFor: { schema: false } }`.', async () => {
    const optimizer = new Optimizer(inputYAML)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.JSON,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: false,
            moveDuplicatesToComponents: true,
          },
          disableOptimizationFor: {
            schema: false,
          },
        })
        .trim()
    ).toEqual(outputJSON_mATCFalse_mDTCTrue_schemaFalse.trim())
  })

  it('should produce the correct optimized file with YAML input and `{ moveAllToComponents: true, moveDuplicatesToComponents: false }, disableOptimizationFor: { schema: false } }`.', async () => {
    const optimizer = new Optimizer(inputYAML)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: true,
            moveDuplicatesToComponents: false,
          },
          disableOptimizationFor: {
            schema: false,
          },
        })
        .trim()
    ).toEqual(outputYAML_mATCTrue_mDTCFalse_schemaFalse.trim())
  })

  it('should produce the correct optimized file with JSON input and `{ moveAllToComponents: true, moveDuplicatesToComponents: false }, disableOptimizationFor: { schema: false } }`.', async () => {
    const optimizer = new Optimizer(inputJSON)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: true,
            moveDuplicatesToComponents: false,
          },
          disableOptimizationFor: {
            schema: false,
          },
        })
        .trim()
    ).toEqual(outputYAML_mATCTrue_mDTCFalse_schemaFalse.trim())
  })

  it('should produce the correct JSON output and `{ moveAllToComponents: true, moveDuplicatesToComponents: false }, disableOptimizationFor: { schema: false } }`.', async () => {
    const optimizer = new Optimizer(inputYAML)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.JSON,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: true,
            moveDuplicatesToComponents: false,
          },
          disableOptimizationFor: {
            schema: false,
          },
        })
        .trim()
    ).toEqual(outputJSON_mATCTrue_mDTCFalse_schemaFalse.trim())
  })

  it('should produce the correct optimized file with YAML input and `{ moveAllToComponents: false, moveDuplicatesToComponents: true }, disableOptimizationFor: { schema: true } }`.', async () => {
    const optimizer = new Optimizer(inputYAML)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: false,
            moveDuplicatesToComponents: true,
          },
          disableOptimizationFor: {
            schema: true,
          },
        })
        .trim()
    ).toEqual(outputYAML_mATCFalse_mDTCTrue_schemaTrue.trim())
  })

  it('should produce the correct optimized file with JSON input and `{ moveAllToComponents: false, moveDuplicatesToComponents: true }, disableOptimizationFor: { schema: true } }`.', async () => {
    const optimizer = new Optimizer(inputJSON)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: false,
            moveDuplicatesToComponents: true,
          },
          disableOptimizationFor: {
            schema: true,
          },
        })
        .trim()
    ).toEqual(outputYAML_mATCFalse_mDTCTrue_schemaTrue.trim())
  })

  it('should produce the correct JSON output and `{ moveAllToComponents: false, moveDuplicatesToComponents: true }, disableOptimizationFor: { schema: true } }`.', async () => {
    const optimizer = new Optimizer(inputYAML)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.JSON,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: false,
            moveDuplicatesToComponents: true,
          },
          disableOptimizationFor: {
            schema: true,
          },
        })
        .trim()
    ).toEqual(outputJSON_mATCFalse_mDTCTrue_schemaTrue.trim())
  })

  it('should produce the correct optimized file with YAML input and `{ moveAllToComponents: true, moveDuplicatesToComponents: false }, disableOptimizationFor: { schema: true } }`.', async () => {
    const optimizer = new Optimizer(inputYAML)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: true,
            moveDuplicatesToComponents: false,
          },
          disableOptimizationFor: {
            schema: true,
          },
        })
        .trim()
    ).toEqual(outputYAML_mATCTrue_mDTCFalse_schemaTrue.trim())
  })

  it('should produce the correct optimized file with JSON input and `{ moveAllToComponents: true, moveDuplicatesToComponents: false }, disableOptimizationFor: { schema: true } }`.', async () => {
    const optimizer = new Optimizer(inputJSON)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: true,
            moveDuplicatesToComponents: false,
          },
          disableOptimizationFor: {
            schema: true,
          },
        })
        .trim()
    ).toEqual(outputYAML_mATCTrue_mDTCFalse_schemaTrue.trim())
  })

  it('should produce the correct JSON output and `{ moveAllToComponents: true, moveDuplicatesToComponents: false }, disableOptimizationFor: { schema: true } }`.', async () => {
    const optimizer = new Optimizer(inputYAML)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.JSON,
          rules: {
            reuseComponents: true,
            removeComponents: true,
            moveAllToComponents: true,
            moveDuplicatesToComponents: false,
          },
          disableOptimizationFor: {
            schema: true,
          },
        })
        .trim()
    ).toEqual(outputJSON_mATCTrue_mDTCFalse_schemaTrue.trim())
  })

  it('should remove unused components when component names contain periods', async () => {
    const inputWithPeriodNames = `asyncapi: 3.0.0
info:
  title: my-app
  version: 1.0.0
channels:
  some_channel:
    address: some_address
    messages:
      Some-Event:
        $ref: '#/components/messages/Some-Event'
operations:
  receiveEvent:
    channel:
      $ref: '#/channels/some_channel'
    action: receive
components:
  messages:
    Some-Event:
      payload:
        type: object
        properties:
          id:
            type: string
    Unused-Event-1.0:
      payload:
        type: object
        properties:
          foo:
            type: object
            $ref: '#/components/schemas/Unused-Schema'
          bar:
            type: array
            items:
              $ref: '#/components/schemas/Unused-Schema-2.0'
  schemas:
    Unused-Schema:
      type: object
      properties:
        name:
          type: string
    Unused-Schema-2.0:
      type: object
      properties:
        name:
          type: string
`
    const expectedOutput = `asyncapi: 3.0.0
info:
  title: my-app
  version: 1.0.0
channels:
  some_channel:
    address: some_address
    messages:
      Some-Event:
        $ref: '#/components/messages/Some-Event'
operations:
  receiveEvent:
    channel:
      $ref: '#/channels/some_channel'
    action: receive
components:
  messages:
    Some-Event:
      payload:
        type: object
        properties:
          id:
            type: string`

    const optimizer = new Optimizer(inputWithPeriodNames)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: false,
            removeComponents: true,
            moveAllToComponents: false,
            moveDuplicatesToComponents: false,
          },
        })
        .trim()
    ).toEqual(expectedOutput.trim())
  })

  it('should reuse components without duplicating channels when channel names contain periods', async () => {
    const inputWithFifoChannel = `asyncapi: 2.0.0
info:
  title: Service
  version: 1.0.0
channels:
  '{ENV}-user-created.fifo':
    publish:
      message:
        payload:
          type: object
          properties:
            eventName:
              type: string
              description: The name of the event.
        x-origin: UserCreated.yaml
components:
  messages:
    UserCreated:
      payload:
        type: object
        properties:
          eventName:
            type: string
            description: The name of the event.
      x-origin: UserCreated.yaml
`
    const expectedOutput = `asyncapi: 2.0.0
info:
  title: Service
  version: 1.0.0
channels:
  '{ENV}-user-created.fifo':
    publish:
      message:
        $ref: '#/components/messages/UserCreated'
components:
  messages:
    UserCreated:
      payload:
        type: object
        properties:
          eventName:
            type: string
            description: The name of the event.
      x-origin: UserCreated.yaml`

    const optimizer = new Optimizer(inputWithFifoChannel)
    await optimizer.getReport()
    expect(
      optimizer
        .getOptimizedDocument({
          output: Output.YAML,
          rules: {
            reuseComponents: true,
            removeComponents: false,
            moveAllToComponents: false,
            moveDuplicatesToComponents: false,
          },
        })
        .trim()
    ).toEqual(expectedOutput.trim())
  })
})
