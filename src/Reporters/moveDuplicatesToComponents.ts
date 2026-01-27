import { Action } from '../Optimizer'
import { createReport, isEqual, isInComponents, getComponentName, toLodashPathSegment } from '../Utils'
import { OptimizableComponent, OptimizableComponentGroup, ReportElement, Reporter } from 'types'
import Debug from 'debug'
const debug = Debug('reporter:moveDuplicatesToComponents')
/**
 *
 * @param optimizableComponentGroup all AsyncAPI Specification-valid components that you want to analyze for duplicates.
 * @returns A list of optimization report elements.
 */
const buildTarget = (groupType: string, componentName: string): string => {
  const componentNameSegment = toLodashPathSegment(componentName)
  return `components.${groupType}${componentNameSegment.startsWith('[') ? '' : '.'}${componentNameSegment}`
}

const handleDuplicate = (
  resultElements: ReportElement[],
  groupType: string,
  component: OptimizableComponent,
  compareComponent: OptimizableComponent
): void => {
  const existingResult = resultElements.find((reportElement) => component.path === reportElement.path)
  if (!existingResult) {
    const target = buildTarget(groupType, getComponentName(component))
    resultElements.push({
      path: component.path,
      action: Action.Move,
      target,
    })
    resultElements.push({
      path: compareComponent.path,
      action: Action.Reuse,
      target,
    })
    return
  }

  resultElements.push({
    path: component.path,
    action: Action.Reuse,
    target: existingResult.target,
  })
}

const findDuplicateComponents = (
  optimizableComponentGroup: OptimizableComponentGroup
): ReportElement[] => {
  const allComponents = optimizableComponentGroup.components
  const insideComponentsSection = allComponents.filter(isInComponents)
  const outsideComponentsSection = getOutsideComponents(allComponents, insideComponentsSection)

  const resultElements: ReportElement[] = []

  for (const [index, component] of outsideComponentsSection.entries()) {
    for (const compareComponent of outsideComponentsSection.slice(index + 1)) {
      if (!isEqual(component.component, compareComponent.component, false)) continue
      handleDuplicate(resultElements, optimizableComponentGroup.type, component, compareComponent)
    }
  }
  debug(
    'duplicte %s: %O',
    optimizableComponentGroup.type,
    resultElements.map((element) => element.path)
  )
  return resultElements
}

export const moveDuplicatesToComponents: Reporter = (optimizableComponentsGroup) => {
  return createReport(
    findDuplicateComponents,
    optimizableComponentsGroup,
    'moveDuplicatesToComponents'
  )
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
