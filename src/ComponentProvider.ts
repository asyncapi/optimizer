/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable security/detect-object-injection */
import type { AsyncAPIDocumentInterface } from '@asyncapi/parser'
import { OptimizableComponentGroup, OptimizableComponent } from 'types'

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
  const pathParts: string[] = []
  for (const rawToken of tokens) {
    // Replace tilde representations (JSON Pointer escaping)
    let token = rawToken.replace(/~1/g, '/')
    token = token.replace(/~0/g, '~')

    // Check if token can be treated as an array index (non-negative integer)
    if (/^\d+$/.test(token)) {
      pathParts.push(`[${token}]`)
    } else if (token.includes('.')) {
      // If the token contains a dot, use bracket notation to prevent lodash
      // from interpreting it as a path separator (e.g., channel names like "user.fifo")
      pathParts.push(`['${token}']`)
    } else {
      pathParts.push(token)
    }
  }

  // Join parts, handling bracket notation properly
  return pathParts
    .map((part, index) => {
      // Array indices and bracket notation should not have a preceding dot
      if (part.startsWith('[')) {
        return part
      }
      // First element should not have a preceding dot
      if (index === 0) {
        return part
      }
      return `.${part}`
    })
    .join('')
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
  asyncAPIDocument: AsyncAPIDocumentInterface,
): OptimizableComponentGroup[] => {
  const optimizeableComponents: OptimizableComponentGroup[] = []
  const getAllComponents = (type: string) => {
    // @ts-ignore
    if (typeof asyncAPIDocument[type] !== 'function') return []
    // @ts-ignore
    return asyncAPIDocument[type]().all().concat(asyncAPIDocument.components()[type]().all())
  }
  const optimizableComponents = {
    servers: getAllComponents('servers'),
    messages: getAllComponents('messages'),
    channels: getAllComponents('channels'),
    schemas: getAllComponents('schemas'),
    operations: getAllComponents('operations'),
    securitySchemes: getAllComponents('securitySchemes'),
    serverVariables: getAllComponents('serverVariables'),
    parameters: getAllComponents('parameters'),
    correlationIds: getAllComponents('correlationIds'),
    replies: getAllComponents('replies'),
    replyAddresses: getAllComponents('replyAddresses'),
    externalDocs: getAllComponents('externalDocs'),
    tags: getAllComponents('tags'),
    operationTraits: getAllComponents('operationTraits'),
    messageTraits: getAllComponents('messageTraits'),
    serverBindings: getAllComponents('serverBindings'),
    channelBindings: getAllComponents('channelBindings'),
    operationBindings: getAllComponents('operationBindings'),
    messageBindings: getAllComponents('messageBindings'),
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
