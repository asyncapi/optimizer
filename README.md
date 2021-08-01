# optimizer
AsyncAPI offers many ways to reuse certain parts of the document like messages or schemas definitions or references to external files, not to even mention the traits. There is a need for a tool that can be plugged into any workflows and optimize documents that are generated from code, but not only.
## Testing
1) Clone the project
  `git https://github.com/asyncapi/optimizer.git`
2) Install the dependencies
  `npm i`
3) open the `index.ts` file and add your testing code before export.
```typescript
import {Optimizer} from './Optimizer';
const yaml = `
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
optimizer.getReport().then(report => {
  console.log(report);
  const optimizedDocument = optimizer.getOptimizedDocument({ rules: {
    reuseComponents: true,
    removeComponents: false,
    moveToComponents: true
  }});
  console.log(optimizedDocument);
});

export { Optimizer };
```
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
    schema-2:
      type: integer
      minimum: 0
      maximum: 100
    schema-1:
      type: object
      properties:
        my-app-header:
          $ref: "#/components/schemas/schema-2"
  parameters:
    parameter-1:
      schema:
        type: string`
 */
```

## API

### Constructor

#### new Optimizer(document)

`document` is a mandatory object which is the parsed AsyncAPI specification from `@asyncapi/parser`:

### Methods

#### getReport(): Promise<OptimizerReport>
`OptimizerReport` is an object that will be returned by this function. This object will contain all the suggested changes by the optimizer grouped by their category.
#### getOptimizedDocument([options]): string
`options` is an OPTIONAL object that contains the following customizations:
* `rules` using rules different optimization types can be enabled or disabled.
    * `reuseComponents` if set to true, optimizer will apply all of *reuseComponents* changes from report. (default: *true*)
    * `removeComponents` if set to true, optimizer will apply all of *removeComponents* changes from report. (default: *true*)
    * `moveToComponents` if set to true, optimizer will apply all of *moveToComponents* changes from report. (default: *true*) 
