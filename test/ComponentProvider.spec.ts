import { asyncapiYAMLWithoutComponents, inputYAML } from './fixtures'
import { parse } from '@asyncapi/parser'
import { isInComponents } from '../src/Utils'
import { getOptimizableComponents } from '../src/ComponentProvider'

describe('ComponentProvider', () => {
  it('should not contain any component from components section', async () => {
    const asyncapiDocument = await parse(asyncapiYAMLWithoutComponents, { applyTraits: false })
    const componentProviderWithoutComponents = getOptimizableComponents(asyncapiDocument)
    for (const componentsGroup of componentProviderWithoutComponents) {
      for (const component of componentsGroup.components) {
        expect(isInComponents(component.path)).toBe(false)
      }
    }
  })

  it('should contain some components from components section', async () => {
    const asyncapiDocument = await parse(inputYAML)
    const componentProviderWithComponents = getOptimizableComponents(asyncapiDocument)
    let inComponentsCounter = 0

    for (const componentsGroup of componentProviderWithComponents) {
      for (const component of componentsGroup.components) {
        if (isInComponents(component.path)) {
          inComponentsCounter++
        }
      }
    }
    expect(inComponentsCounter).toBeGreaterThan(0)
  })
})
