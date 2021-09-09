import { asyncapiYAMLWithoutComponents, asyncapiYAML } from './fixtures';
import { parse } from '@asyncapi/parser';
import { ComponentProvider } from '../src/ComponentProvider';
import { isInComponents } from '../src/Utils';

describe('ComponentProvider', () => {
  it('should not contain any component from components section', async () => {
    const asyncapiDocument = await parse(asyncapiYAMLWithoutComponents, { applyTraits: false });
    const componentProviderWithoutComponents = new ComponentProvider(asyncapiDocument);
    for (const key of componentProviderWithoutComponents.parameters.keys()) {
      expect(isInComponents(key)).toBe(false);
    }
    for (const key of componentProviderWithoutComponents.messages.keys()) {
      expect(isInComponents(key)).toBe(false);
    }
    for (const key of componentProviderWithoutComponents.schemas.keys()) {
      expect(isInComponents(key)).toBe(false);
    }
  });

  it('should contain some components from components section', async () => {
    const asyncapiDocument = await parse(asyncapiYAML);
    const componentProviderWithComponents = new ComponentProvider(asyncapiDocument);
    let inComponentsCounter = 0;
    for (const key of componentProviderWithComponents.parameters.keys()) {
      if (isInComponents(key)) {
        inComponentsCounter++;
      }
    }
    for (const key of componentProviderWithComponents.messages.keys()) {
      if (isInComponents(key)) {
        inComponentsCounter++;
      }
    }
    for (const key of componentProviderWithComponents.schemas.keys()) {
      if (isInComponents(key)) {
        inComponentsCounter++;
      }
    }
    expect(inComponentsCounter).toBeGreaterThan(0);
  });
});
