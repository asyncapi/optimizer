import { moveToComponents, reuseComponents, removeComponents } from '../../src/Reporters'
import { inputYAML } from '../fixtures'
import { parse } from '@asyncapi/parser'
import { getOptimizableComponents } from '../../src/ComponentProvider'
import { OptimizableComponentGroup } from '../../src/index.d'

const MoveToComponentsExpectedResult = [
  {
    path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.subscribe.message.traits[0].headers',
    action: 'move',
    target: 'components.schemas.schema-1',
  },
  {
    path: 'channels.smartylighting/action/{streetlightId}/turn/on.publish.message.traits[0].headers',
    action: 'reuse',
    target: 'components.schemas.schema-1',
  },
  {
    path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.subscribe.message.traits[0].headers.properties.my-app-header',
    action: 'move',
    target: 'components.schemas.schema-2',
  },
  {
    path: 'channels.smartylighting/action/{streetlightId}/turn/on.publish.message.traits[0].headers.properties.my-app-header',
    action: 'reuse',
    target: 'components.schemas.schema-2',
  },
  {
    path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.parameters.streetlightId',
    action: 'move',
    target: 'components.parameters.parameter-1',
  },
  {
    path: 'channels.smartylighting/action/{streetlightId}/turn/on.parameters.streetlightId',
    action: 'reuse',
    target: 'components.parameters.parameter-1',
  },
]
const RemoveComponentsExpectedResult = [
  { path: 'components.messages.unusedMessage', action: 'remove' },
  { path: 'components.parameters.unusedParameter', action: 'remove' },
]
const ReuseComponentsExpectedResult = [
  {
    path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.subscribe.message.payload.properties.sentAt',
    action: 'reuse',
    target: 'components.schemas.sentAt',
  },
]

describe('Optimizers', () => {
  let optimizableComponents: OptimizableComponentGroup[]
  beforeAll(async () => {
    const asyncapiDocument = await parse(inputYAML, { applyTraits: false })
    optimizableComponents = getOptimizableComponents(asyncapiDocument)
  })
  describe('MoveToComponents', () => {
    test('should contain the correct optimizations.', () => {
      const report = moveToComponents(optimizableComponents)
      expect(report.elements).toEqual(MoveToComponentsExpectedResult)
      expect(report.type).toEqual('moveToComponents')
    })
  })

  describe('RemoveComponents', () => {
    test('should contain the correct optimizations.', () => {
      const report = removeComponents(optimizableComponents)
      expect(report.elements).toEqual(RemoveComponentsExpectedResult)
      expect(report.type).toEqual('removeComponents')
    })
  })

  describe('ReuseComponents', () => {
    test('should contain the correct optimizations.', () => {
      const report = reuseComponents(optimizableComponents)
      expect(report.elements).toEqual(ReuseComponentsExpectedResult)
      expect(report.type).toEqual('reuseComponents')
    })
  })
})
