import type { AsyncAPIDocumentInterface } from '@asyncapi/parser'
import { OptimizableComponentGroup, OptimizableComponent } from 'index.d'

import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'

export const toLodashPath = (jsonPointer: string): string => {
  // Remove leading slash if present
  if (jsonPointer.startsWith('/')) {
    jsonPointer = jsonPointer.slice(1)
  }

  // Split the JSON Pointer into tokens
  const tokens = jsonPointer.split('/')

  // Unescape the special characters and transform into Lodash path
  return tokens
    .map((token) => {
      // Replace tilde representations
      token = token.replace(/~1/g, '/')
      token = token.replace(/~0/g, '~')

      // Check if token can be treated as an array index (non-negative integer)
      if (/^\d+$/.test(token)) {
        return `[${token}]`
      }
      // For nested properties, use dot notation
      return token
    })
    .join('.')
}

export const parseComponentsFromPath = (
  asyncAPIDocument: AsyncAPIDocumentInterface,
  paths: string[]
): OptimizableComponent[] => {
  return _.chain(paths)
    .map((path) => {
      return JSONPath({
        resultType: 'all',
        json: asyncAPIDocument.json(),
        path,
      })
    })
    .flatten()
    .map((component) => ({
      path: toLodashPath(component.path),
      component: component.value,
    }))
    .value()
}

export const getOptimizableComponents = (
  asyncAPIDocument: AsyncAPIDocumentInterface
): OptimizableComponentGroup[] => {
  const optimizeableComponents: OptimizableComponentGroup[] = []

  const optimizableComponents = {
    servers: asyncAPIDocument.allServers().all(),
    messages: asyncAPIDocument.allMessages().all(),
    channels: asyncAPIDocument.allChannels().all(),
    schemas: asyncAPIDocument.allSchemas().all(),
    operations: asyncAPIDocument.allOperations().all(),
  }
  for (const [type, components] of Object.entries(optimizableComponents)) {
    if (components.length === 0) continue
    optimizeableComponents.push({
      type,
      components: components.map((component: any) => ({
        path: toLodashPath(component.jsonPath()),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        component: component.json(),
      })),
    })
  }
  return optimizeableComponents
}
