import { inputJSON, inputYAML, outputJSON, outputYAML } from './fixtures'
import { Optimizer } from '../src'
import { Output } from '../src/Optimizer'

describe('Optimizer', () => {
  it('should produce the correct optimized file with YAML input.', async () => {
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
    ).toEqual(outputYAML.trim())
  })

  it('should produce the correct optimized file with JSON input.', async () => {
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
    ).toEqual(outputYAML.trim())
  })

  it('should produce the correct JSON output.', async () => {
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
    ).toEqual(outputJSON.trim())
  })
})
