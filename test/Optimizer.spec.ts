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
import YAML from 'js-yaml'

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

  it('should remove unused components whose names contain dots (issue #273)', async () => {
    const input = `
asyncapi: 3.0.0
info:
  title: test
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
            type: number
`.trim()

    const optimizer = new Optimizer(input)
    await optimizer.getReport()
    const result = optimizer.getOptimizedDocument({
      rules: { removeComponents: true, moveAllToComponents: false, reuseComponents: false },
    })
    const parsed = YAML.load(result) as any
    expect(parsed.components?.messages?.['Unused-Event-1.0']).toBeUndefined()
    expect(parsed.components?.messages?.['Some-Event']).toBeDefined()
  })
})
