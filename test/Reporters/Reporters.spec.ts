import {
  moveAllToComponents,
  moveDuplicatesToComponents,
  reuseComponents,
  removeComponents,
} from '../../src/Reporters'
import { inputYAML } from '../fixtures'
import { Parser } from '@asyncapi/parser'
import { getOptimizableComponents } from '../../src/ComponentProvider'
import { OptimizableComponentGroup } from '../../src/index.d'

const moveAllToComponentsExpectedResult: any[] = [
  {
    action: 'move',
    path: 'channels.withDuplicatedMessage1.messages.duped1',
    target: 'components.messages.withDuplicatedMessage1',
  },
  {
    action: 'move',
    path: 'channels.withDuplicatedMessage2.messages.duped2',
    target: 'components.messages.withDuplicatedMessage2',
  },
  {
    action: 'move',
    path: 'channels.withFullFormMessage.messages.canBeReused',
    target: 'components.messages.withFullFormMessage',
  },
  {
    action: 'move',
    path: 'channels.withDuplicatedMessage1',
    target: 'components.channels.withDuplicatedMessage1FromXOrigin',
  },
  {
    action: 'move',
    path: 'channels.withDuplicatedMessage2',
    target: 'components.channels.withDuplicatedMessage2',
  },
  {
    action: 'move',
    path: 'channels.withFullFormMessage',
    target: 'components.channels.withFullFormMessage',
  },
  {
    action: 'move',
    path: 'channels.UserSignedUp1',
    target: 'components.channels.UserSignedUp1',
  },
  {
    action: 'move',
    path: 'channels.UserSignedUp2',
    target: 'components.channels.UserSignedUp2',
  },
  {
    action: 'move',
    path: 'channels.deleteAccount',
    target: 'components.channels.deleteAccount',
  },
  {
    action: 'move',
    path: 'channels.withDuplicatedMessage1.messages.duped1.payload',
    target: 'components.schemas.withDuplicatedMessage1',
  },
  {
    action: 'move',
    path: 'channels.withDuplicatedMessage2.messages.duped2.payload',
    target: 'components.schemas.withDuplicatedMessage2',
  },
  {
    action: 'move',
    path: 'channels.UserSignedUp1.messages.myMessage.payload',
    target: 'components.schemas.UserSignedUp1',
  },
  {
    action: 'move',
    path: 'channels.UserSignedUp1.messages.myMessage.payload.properties.displayName',
    target: 'components.schemas.UserSignedUp1',
  },
  {
    action: 'move',
    path: 'channels.UserSignedUp1.messages.myMessage.payload.properties.email',
    target: 'components.schemas.UserSignedUp1',
  },
  {
    action: 'move',
    path: 'channels.deleteAccount.messages.deleteUser.payload',
    target: 'components.schemas.deleteAccount',
  },
  {
    action: 'move',
    path: 'operations.user/deleteAccount.subscribe',
    target: 'components.operations.user/deleteAccount',
  },
]
const moveDuplicatesToComponentsExpectedResult: any[] = [
  {
    path: 'channels.withDuplicatedMessage1.messages.duped1',
    action: 'move',
    target: 'components.messages.withDuplicatedMessage1',
  },
  {
    path: 'channels.withDuplicatedMessage2.messages.duped2',
    action: 'reuse',
    target: 'components.messages.withDuplicatedMessage1',
  },
  {
    path: 'channels.UserSignedUp1',
    action: 'move',
    target: 'components.channels.UserSignedUp1',
  },
  {
    path: 'channels.UserSignedUp2',
    action: 'reuse',
    target: 'components.channels.UserSignedUp1',
  },
  {
    path: 'channels.withDuplicatedMessage1.messages.duped1.payload',
    action: 'move',
    target: 'components.schemas.withDuplicatedMessage1',
  },
  {
    path: 'channels.withDuplicatedMessage2.messages.duped2.payload',
    action: 'reuse',
    target: 'components.schemas.withDuplicatedMessage1',
  },
]
const RemoveComponentsExpectedResult = [
  { path: 'components.messages.unUsedMessage', action: 'remove' },
  { path: 'components.channels.unUsedChannel', action: 'remove' },
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
  describe('moveAllToComponents', () => {
    test('should contain the correct optimizations.', () => {
      const report = moveAllToComponents(optimizableComponents)
      expect(report.elements).toEqual(moveAllToComponentsExpectedResult)
      expect(report.type).toEqual('moveAllToComponents')
    })
  })

  describe('moveDuplicatesToComponents', () => {
    test('should contain the correct optimizations.', () => {
      const report = moveDuplicatesToComponents(optimizableComponents)
      expect(report.elements).toEqual(moveDuplicatesToComponentsExpectedResult)
      expect(report.type).toEqual('moveDuplicatesToComponents')
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
