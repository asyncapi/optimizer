import { MoveToComponents, ReuseComponents, RemoveComponents } from '../../src/Optimizers';
import { asyncapiYAML } from '../fixtures';
import { parse } from '@asyncapi/parser';
import { ComponentProvider } from '../../src/ComponentProvider';

const MoveToComponentsExpectedResult = [{ path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.subscribe.message.traits[0].headers', action: 'move', target: 'components.schemas.schema-1' }, { path: 'channels.smartylighting/action/{streetlightId}/turn/on.publish.message.traits[0].headers', action: 'reuse', target: 'components.schemas.schema-1' }, { path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.subscribe.message.traits[0].headers.properties.my-app-header', action: 'move', target: 'components.schemas.schema-2' }, { path: 'channels.smartylighting/action/{streetlightId}/turn/on.publish.message.traits[0].headers.properties.my-app-header', action: 'reuse', target: 'components.schemas.schema-2' }, { path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.parameters.streetlightId', action: 'move', target: 'components.parameters.parameter-1' }, { path: 'channels.smartylighting/action/{streetlightId}/turn/on.parameters.streetlightId', action: 'reuse', target: 'components.parameters.parameter-1' }];
const RemoveComponentsExpectedResult = [{ path: 'components.messages.unusedMessage', action: 'remove' }, { path: 'components.parameters.unusedParameter', action: 'remove' }];
const ReuseComponentsExpectedResult = [{ path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.subscribe.message.payload.properties.sentAt', action: 'reuse', target: 'components.schemas.sentAt' }];

describe('Optimizers', () => {
  let componentProvider: ComponentProvider;
  beforeAll(async () => {
    const asyncapiDocument = await parse(asyncapiYAML);
    componentProvider = new ComponentProvider(asyncapiDocument);
  });
  describe('MoveToComponents', () => {
    test('should contain the correct optimizations.', () => {
      const moveToComponents = new MoveToComponents(componentProvider);
      const report = moveToComponents.getReport();
      expect(report).toEqual(MoveToComponentsExpectedResult);
    });
  });
    
  describe('RemoveComponents', () => {
    test('should contain the correct optimizations.', () => {
      const moveToComponents = new RemoveComponents(componentProvider);
      const report = moveToComponents.getReport();
      expect(report).toEqual(RemoveComponentsExpectedResult);
    });
  });

  describe('ReuseComponents', () => {
    test('should contain the correct optimizations.', () => {
      const moveToComponents = new ReuseComponents(componentProvider);
      const report = moveToComponents.getReport();
      expect(report).toEqual(ReuseComponentsExpectedResult);
    });
  });
});
