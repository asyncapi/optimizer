[![AsyncAPI Optimizer](./assets/readme-banner.png)](https://www.asyncapi.com)

AsyncAPI offers many ways to reuse certain parts of the document like messages or schemas definitions or references to external files, not to even mention the traits. Purpose of **AsyncAPI Optimizer** is to enable different ways to optimize AsyncAPI files. It is a library that can be used in UIs and CLIs.

![npm](https://img.shields.io/npm/v/@asyncapi/optimizer?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@asyncapi/optimizer?style=for-the-badge)

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Testing](#testing)
- [Usage](#usage)
  - [Node.js](#nodejs)
  - [Generating report](#generating-report)
  - [Applying the suggested changes](#applying-the-suggested-changes)
- [API documentation](#api-documentation)

<!-- tocstop -->

## Testing

1. Clone the project
   `git clone https://github.com/asyncapi/optimizer.git`
2. Install the dependencies
   `npm i`
3. for a quick check you can run `npm run example`. You can open `examples/index.js` modify it or add your own AsyncAPI document for optimization.

## Usage

### Node.js

```typescript
import { Optimizer } from '@asyncapi/optimizer'
import type { Report } from '@asyncapi/optimizer'

const yaml = `
asyncapi: 3.0.0
info:
  title: Example Service
  version: 1.0.0
  description: Example Service.
servers:
  production:
    host: 'test.mosquitto.org:{port}'
    protocol: mqtt
    description: Test broker
    variables:
      port:
        description: Secure connection (TLS) is available through port 8883.
        default: '1883'
        enum:
          - '1883'
          - '8883'
operations:
  user/deleteAccount.subscribe:
    action: send
    channel:
      $ref: '#/channels/commentLikedChannel'
channels:
  commentLikedChannel:
    address: comment/liked
    messages:
      commentLikedMessage:
        description: Message that is being sent when a comment has been liked by someone.
        payload:
          type: object
          title: commentLikedPayload
          properties:
            commentId:
              type: string
              description: an id object
              x-origin: ./schemas.yaml#/schemas/idSchema
          x-origin: ./schemas.yaml#/schemas/commentLikedSchema
        x-origin: ./messages.yaml#/messages/commentLikedMessage
    x-origin: ./channels.yaml#/channels/commentLikedChannel`

const optimizer = new Optimizer(yaml)
```

### Generating report

```typescript
const report: Report = await optimizer.getReport()
/*
the report value will be:
{
  removeComponents: [],
  reuseComponents: [],
  moveAllToComponents: [
    {
      path: 'channels.commentLikedChannel.messages.commentLikedMessage.payload.properties.commentId',
      action: 'move',
      target: 'components.schemas.idSchema'
    },
    {
      path: 'channels.commentLikedChannel.messages.commentLikedMessage.payload',
      action: 'move',
      target: 'components.schemas.commentLikedSchema'
    },
    {
      path: 'channels.commentLikedChannel.messages.commentLikedMessage',
      action: 'move',
      target: 'components.messages.commentLikedMessage'
    },
    {
      path: 'operations.user/deleteAccount.subscribe',
      action: 'move',
      target: 'components.operations.subscribe'
    },
    {
      path: 'channels.commentLikedChannel',
      action: 'move',
      target: 'components.channels.commentLikedChannel'
    },
    {
      path: 'servers.production',
      action: 'move',
      target: 'components.servers.production'
    }
  ],
  moveDuplicatesToComponents: []
}
 */
```

### Applying the suggested changes

```typescript
const optimizedDocument = optimizer.getOptimizedDocument({
  output: 'YAML',
  rules: {
    reuseComponents: true,
    removeComponents: true,
    moveAllToComponents: true,
    moveDuplicatesToComponents: false,
  },
  disableOptimizationFor: {
    schema: false,
  },
})
/*
the optimizedDocument value will be:

asyncapi: 3.0.0
info:
  title: Example Service
  version: 1.0.0
  description: Example Service.
servers:
  production:
    $ref: '#/components/servers/production'
operations:
  user/deleteAccount.subscribe:
    action: send
    channel:
      $ref: '#/channels/commentLikedChannel'
  user/deleteAccount:
    subscribe:
      $ref: '#/components/operations/subscribe'
channels:
  commentLikedChannel:
    $ref: '#/components/channels/commentLikedChannel'
components:
  schemas:
    idSchema:
      type: string
      description: an id object
      x-origin: ./schemas.yaml#/schemas/idSchema
    commentLikedSchema:
      type: object
      title: commentLikedPayload
      properties:
        commentId:
          $ref: '#/components/schemas/idSchema'
      x-origin: ./schemas.yaml#/schemas/commentLikedSchema
  messages:
    commentLikedMessage:
      description: Message that is being sent when a comment has been liked by someone.
      payload:
        $ref: '#/components/schemas/commentLikedSchema'
      x-origin: ./messages.yaml#/messages/commentLikedMessage
  operations: {}
  channels:
    commentLikedChannel:
      address: comment/liked
      messages:
        commentLikedMessage:
          $ref: '#/components/messages/commentLikedMessage'
      x-origin: ./channels.yaml#/channels/commentLikedChannel
  servers:
    production:
      host: test.mosquitto.org:{port}
      protocol: mqtt
      description: Test broker
      variables:
        port:
          description: Secure connection (TLS) is available through port 8883.
          default: '1883'
          enum:
            - '1883'
            - '8883'
 */
```

## API documentation

For using the optimizer to optimize file you just need to import the `Optimizer` class. Use its two methods to get the report (`getReport()`) and get the optimized document (`getOptimizedDocument()`).

See [API documentation](./API.md) for more example and full API reference information.
