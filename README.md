<h5 align="center">
  <br>
  <a href="https://www.asyncapi.org"><img src="https://github.com/asyncapi/parser-nodejs/raw/master/assets/logo.png" alt="AsyncAPI logo" width="200"></a>
  <br>
  Optimizer
</h5>
<p align="center">
  <em>AsyncAPI offers many ways to reuse certain parts of the document like messages or schemas definitions or references to external files, not to even mention the traits. Purpose of **AsyncAPI Optimizer** is to enable different ways to optimize AsyncAPI files. It is a library that can be used in UIs and CLIs.</em>
</p>

![npm](https://img.shields.io/npm/v/@asyncapi/optimizer?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@asyncapi/optimizer?style=for-the-badge)

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Testing](#testing)
- [Usage](#usage)
  * [Node.js](#nodejs)
  * [Generating report](#generating-report)
  * [Applying the suggested changes](#applying-the-suggested-changes)
- [API documentation](#api-documentation)

<!-- tocstop -->

## Testing
1) Clone the project
  `git https://github.com/asyncapi/optimizer.git`
2) Install the dependencies
  `npm i`
3) for a quick check you can run `npm run example`. You can open `examples/index.js` modify it or add your own AsyncAPI document for optimization.

## Usage

### Node.js

```typescript
import { Optimizer } from '@asyncapi/optimizer';
import type { Report } from '@asyncapi/optimizer';

const yaml =`
asyncapi: 2.0.0
info:
  title: Streetlights API
  version: '1.0.0'

channels:

  smartylighting/event/{streetlightId}/lighting/measured:
    parameters:
      #this parameter is duplicated. it can be moved to components and ref-ed from here.
      streetlightId:
        schema:
          type: string
    subscribe:
      operationId: receiveLightMeasurement
      traits:
        - bindings:
            kafka:
              clientId: my-app-id
      message:
        name: lightMeasured
        title: Light measured
        contentType: application/json
        traits:
          - headers:
              type: object
              properties:
                my-app-header:
                  type: integer
                  minimum: 0
                  maximum: 100
        payload:
          type: object
          properties:
            lumens:
              type: integer
              minimum: 0
            #full form is used, we can ref it to: #/components/schemas/sentAt
            sentAt:
              type: string
              format: date-time

  smartylighting/action/{streetlightId}/turn/on:
    parameters:
      streetlightId:
        schema:
          type: string
    publish:
      operationId: turnOn
      traits:
        - bindings:
            kafka:
              clientId: my-app-id
      message:
        name: turnOnOff
        title: Turn on/off
        traits:
          - headers:
              type: object
              properties:
                my-app-header:
                  type: integer
                  minimum: 0
                  maximum: 100
        payload:
          type: object
          properties:
            sentAt:
              $ref: "#/components/schemas/sentAt"

components:
  messages:
    #libarary should be able to find and delete this message, because it is not used anywhere.
    unusedMessage:
      name: unusedMessage
      title: This message is not used in any channel.
      
  schemas:
    #this schema is ref-ed in one channel and used full form in another. library should be able to identify and ref the second channel as well.
    sentAt:
      type: string
      format: date-time`;

const optimizer = new Optimizer(yaml);
```
### Generating report
```typescript
const report: Report = await optimizer.getReport();
/*
the report value will be:
{
  reuseComponents: [
    {
      path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.message.payload.properties.sentAt',
      action: 'reuse',
      target: 'components.schemas.sentAt'
    }
  ],
  removeComponents: [
    {
      path: 'components.messages.unusedMessage',
      action: 'remove',
    }
  ],
  moveToComponents: [
    {
      //move will ref the current path to the moved component as well.
      path: 'channels.smartylighting/event/{streetlightId}/lighting/measured.parameters.streetlightId',
      action: 'move',
      target: 'components.parameters.streetlightId'
    },
    {
      path: 'channels.smartylighting/action/{streetlightId}/turn/on.parameters.streetlightId',
      action: 'reuse',
      target: 'components.parameters.streetlightId'
    }
  ]
}
 */
```
### Applying the suggested changes
```typescript
const optimizedDocument = optimizer.getOptimizedDocument({
  rules: {
    reuseComponents: true,
    removeComponents: true,
    moveToComponents: true 
  }
});
/*
the optimizedDocument value will be:

asyncapi: 2.0.0
info:
  title: Streetlights API
  version: 1.0.0
channels:
  "smartylighting/event/{streetlightId}/lighting/measured":
    parameters:
      streetlightId:
        $ref: "#/components/parameters/parameter-1"
    subscribe:
      operationId: receiveLightMeasurement
      traits:
        - bindings:
            kafka:
              clientId: my-app-id
      message:
        name: lightMeasured
        title: Light measured
        contentType: application/json
        traits:
          - headers:
              $ref: "#/components/schemas/schema-1"
        payload:
          type: object
          properties:
            lumens:
              type: integer
              minimum: 0
            sentAt:
              $ref: "#/components/schemas/sentAt"
  "smartylighting/action/{streetlightId}/turn/on":
    parameters:
      streetlightId:
        $ref: "#/components/parameters/parameter-1"
    publish:
      operationId: turnOn
      traits:
        - bindings:
            kafka:
              clientId: my-app-id
      message:
        name: turnOnOff
        title: Turn on/off
        traits:
          - headers:
              $ref: "#/components/schemas/schema-1"
        payload:
          type: object
          properties:
            sentAt:
              $ref: "#/components/schemas/sentAt"
components:
  schemas:
    sentAt:
      type: string
      format: date-time
    schema-1:
      type: object
      properties:
        my-app-header:
          type: integer
          minimum: 0
          maximum: 100
  parameters:
    parameter-1:
      schema:
        type: string`
 */
```

## API documentation

For using the optimizer to optimize file you just need to import the `Optimizer` class. Use its two methods to get the report (`getReport()`) and get the optimized document (`getOptimizedDocument()`).

See [API documentation](/API.md) for more example and full API reference information.
