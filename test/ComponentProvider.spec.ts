import { asyncapiYAMLWithoutComponents, asyncapiYAML } from './fixtures';
import { parse } from '@asyncapi/parser';
import { ComponentProvider } from '../src/ComponentProvider';
import { isInComponents } from '../src/Utils';

describe('ComponentProvider', () => {
  let componentProviderWithoutComponents: ComponentProvider;
  let componentProviderWithComponents: ComponentProvider;
  beforeAll(async () => {
    let asyncapiDocument = await parse(asyncapiYAMLWithoutComponents);
    componentProviderWithoutComponents = new ComponentProvider(asyncapiDocument);
    asyncapiDocument = await parse(asyncapiYAML);
    componentProviderWithComponents = new ComponentProvider(asyncapiDocument);
  });
  test('should not contain any component from components section', () => {
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
  test('should contain some components from components section', () => {
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
