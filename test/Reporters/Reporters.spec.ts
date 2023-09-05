import { moveToComponents, reuseComponents, removeComponents } from '../../src/Reporters'
import { inputYAML } from '../fixtures'
import { Parser } from '@asyncapi/parser'
import { getOptimizableComponents } from '../../src/ComponentProvider'
import { OptimizableComponentGroup } from '../../src/index.d'

const MoveToComponentsExpectedResult: any[] = [
  {
    path: 'channels.withDuplicatedMessage1.messages.duped1',
    action: 'move',
    target: 'components.messages.message-1',
  },
  {
    path: 'channels.withDuplicatedMessage2.messages.duped2',
    action: 'reuse',
    target: 'components.messages.message-1',
  },
  {
    path: 'channels.UserSignedUp1',
    action: 'move',
    target: 'components.channels.channel-1',
  },
  {
    path: 'channels.UserSignedUp2',
    action: 'reuse',
    target: 'components.channels.channel-1',
  },
  {
    path: 'channels.withDuplicatedMessage1.messages.duped1.payload',
    action: 'move',
    target: 'components.schemas.schema-1',
  },
  {
    path: 'channels.withDuplicatedMessage2.messages.duped2.payload',
    action: 'reuse',
    target: 'components.schemas.schema-1',
  },
]
const RemoveComponentsExpectedResult = [
  { path: 'components.messages.unUsedMessage', action: 'remove' },
  { path: 'components.channels.unUsedChannel', action: 'remove' },
  {
    path: 'components.messages.unUsedMessage.payload',
    action: 'remove',
  },
  { path: 'components.schemas.canBeReused', action: 'remove' },
]
const ReuseComponentsExpectedResult = [
  {
    path: 'channels.withFullFormMessage.messages.canBeReused.payload',
    action: 'reuse',
    target: 'components.schemas.canBeReused',
  },
]

describe('Optimizers', () => {
  let optimizableComponents: OptimizableComponentGroup[]
  beforeAll(async () => {
    const asyncapiDocument = await new Parser().parse(inputYAML, { applyTraits: false })
    optimizableComponents = getOptimizableComponents(asyncapiDocument.document!)
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
