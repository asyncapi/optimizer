import { asyncapiYAMLWithoutComponents } from './inputs';
import { parse } from '@asyncapi/parser';
import { ComponentProvider } from '../src/ComponentProvider';
import { isInComponents } from '../src/Utils';

describe('ComponentProvider', () => {
  let componentProvider: ComponentProvider;
  beforeAll(async () => {
    const asyncapiDocument = await parse(asyncapiYAMLWithoutComponents);
    componentProvider = new ComponentProvider(asyncapiDocument);
  });
  test('should not contain any component from components section', () => {
    for (const key of componentProvider.parameters.keys()) {
      expect(isInComponents(key)).toBe(false);
    }
    for (const key of componentProvider.messages.keys()) {
      expect(isInComponents(key)).toBe(false);
    }
    for (const key of componentProvider.schemas.keys()) {
      expect(isInComponents(key)).toBe(false);
    }
  });
});
