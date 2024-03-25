import { Action } from '../Optimizer'
import { createReport, isEqual, isInComponents } from '../Utils'
import { OptimizableComponent, OptimizableComponentGroup, ReportElement, Reporter } from 'index.d'
import Debug from 'debug'
const debug = Debug('reporter:moveAllToComponents')
/**
 *
 * @param optimizableComponentGroup all AsyncAPI Specification-valid components.
 * @returns A list of optimization report elements.
 */
const findAllComponents = (
  optimizableComponentGroup: OptimizableComponentGroup
): ReportElement[] => {
  const allComponents = optimizableComponentGroup.components
  const insideComponentsSection = allComponents.filter(isInComponents)
  const outsideComponentsSection = getOutsideComponents(allComponents, insideComponentsSection)

  const resultElements: ReportElement[] = []

  for (const [index, component] of outsideComponentsSection.entries()) {
    const existingResult = resultElements.filter(
      (reportElement) => component.path === reportElement.path
    )[0]
    if (!existingResult) {
      let componentName: string
      if (component.component['x-origin']) {
        componentName = String(component.component['x-origin']).split('/').reverse()[0]
      } else {
        componentName = String(component.path).split('.')[1]
      }
      const target = `components.${optimizableComponentGroup.type}.${componentName}`
      resultElements.push({
        path: component.path,
        action: Action.Move,
        target,
      })
    }
  }
  debug(
    'all %s: %O',
    optimizableComponentGroup.type,
    resultElements.map((element) => element.path)
  )
  return resultElements
}

export const moveAllToComponents: Reporter = (optimizableComponentsGroup) => {
  return createReport(findAllComponents, optimizableComponentsGroup, 'moveAllToComponents')
}

function getOutsideComponents(
  allComponents: OptimizableComponent[],
  insideComponentsSection: OptimizableComponent[]
) {
  return allComponents.filter(
    (component) =>
      !isInComponents(component) &&
      insideComponentsSection.filter((inCSC) => isEqual(component.component, inCSC.component, true))
        .length === 0
  )
}
