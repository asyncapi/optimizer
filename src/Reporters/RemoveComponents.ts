import { Action } from '../Optimizer'
import { OptimizableComponentGroup, ReportElement, Reporter } from '../index.d'
import { createReport, isInComponents } from '../Utils'

const findUnusedComponents = (componentsGroup: OptimizableComponentGroup): ReportElement[] => {
  const allComponents = componentsGroup.components
  const insideComponentsSection = new Set([...allComponents].filter(isInComponents))
  const outsideComponentsSection = new Set(
    allComponents
      .filter((component) => !insideComponentsSection.has(component))
      .map((component) => component.component)
  )
  const unusedComponents = [...insideComponentsSection].filter(
    (component) => !outsideComponentsSection.has(component.component)
  )
  return unusedComponents.map((component) => ({ path: component.path, action: Action.Remove }))
}

export const removeComponents: Reporter = (optimizeableComponents) => {
  return createReport(findUnusedComponents, optimizeableComponents, 'removeComponents')
}
