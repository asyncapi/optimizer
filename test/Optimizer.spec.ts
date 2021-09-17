import { inputJSON, inputYAML, outputJSON, outputYAML } from './fixtures';
import { Optimizer } from '../src';
import { Output } from '../src/Models';

describe('Optimizer', () => {
  it('should produce the correct optimized file with YAML input.', async () => {
    const optimizer = new Optimizer(inputYAML);
    await optimizer.getReport();
    expect(optimizer.getOptimizedDocument().trim()).toEqual(outputYAML.trim());
  });

  it('should produce the correct optimized file with JSON input.', async () => {
    const optimizer = new Optimizer(inputJSON);
    await optimizer.getReport();
    expect(optimizer.getOptimizedDocument().trim()).toEqual(outputYAML.trim());
  });

  it('should produce the correct JSON output.', async () => {
    const optimizer = new Optimizer(inputYAML);
    await optimizer.getReport();
    expect(optimizer.getOptimizedDocument({ output: Output.JSON }).trim()).toEqual(outputJSON.trim());
  });
});
