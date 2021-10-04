export const asyncapiYAMLWithoutComponents = `asyncapi: 2.0.0
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
        headers:
          type: object
        traits:
          - headers:
              properties:
                my-app-header:
                  type: integer
                  minimum: 0
                  maximum: 100
        payload:
          type: object
          properties:
            sentAt:
              type: string
              format: date-time`;

export const inputYAML = `asyncapi: 2.0.0
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
      format: date-time
  parameters:
    unusedParameter:
      schema:
        type: number`;
export const outputYAML = `asyncapi: 2.0.0
info:
  title: Streetlights API
  version: 1.0.0
channels:
  smartylighting/event/{streetlightId}/lighting/measured:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/parameter-1'
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
              $ref: '#/components/schemas/schema-1'
        payload:
          type: object
          properties:
            lumens:
              type: integer
              minimum: 0
            sentAt:
              $ref: '#/components/schemas/sentAt'
  smartylighting/action/{streetlightId}/turn/on:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/parameter-1'
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
              $ref: '#/components/schemas/schema-1'
        payload:
          type: object
          properties:
            sentAt:
              $ref: '#/components/schemas/sentAt'
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
          $ref: '#/components/schemas/schema-2'
  parameters:
    parameter-1:
      schema:
        type: string`;
 
export const inputJSON = '{"asyncapi":"2.0.0","info":{"title":"Streetlights API","version":"1.0.0"},"channels":{"smartylighting/event/{streetlightId}/lighting/measured":{"parameters":{"streetlightId":{"schema":{"type":"string"}}},"subscribe":{"operationId":"receiveLightMeasurement","traits":[{"bindings":{"kafka":{"clientId":"my-app-id"}}}],"message":{"name":"lightMeasured","title":"Light measured","contentType":"application/json","traits":[{"headers":{"type":"object","properties":{"my-app-header":{"type":"integer","minimum":0,"maximum":100}}}}],"payload":{"type":"object","properties":{"lumens":{"type":"integer","minimum":0},"sentAt":{"type":"string","format":"date-time"}}}}}},"smartylighting/action/{streetlightId}/turn/on":{"parameters":{"streetlightId":{"schema":{"type":"string"}}},"publish":{"operationId":"turnOn","traits":[{"bindings":{"kafka":{"clientId":"my-app-id"}}}],"message":{"name":"turnOnOff","title":"Turn on/off","traits":[{"headers":{"type":"object","properties":{"my-app-header":{"type":"integer","minimum":0,"maximum":100}}}}],"payload":{"type":"object","properties":{"sentAt":{"$ref":"#/components/schemas/sentAt"}}}}}}},"components":{"messages":{"unusedMessage":{"name":"unusedMessage","title":"This message is not used in any channel."}},"schemas":{"sentAt":{"type":"string","format":"date-time"}},"parameters":{"unusedParameter":{"schema":{"type":"number"}}}}}';
export const outputJSON = '{"asyncapi":"2.0.0","info":{"title":"Streetlights API","version":"1.0.0"},"channels":{"smartylighting/event/{streetlightId}/lighting/measured":{"parameters":{"streetlightId":{"$ref":"#/components/parameters/parameter-1"}},"subscribe":{"operationId":"receiveLightMeasurement","traits":[{"bindings":{"kafka":{"clientId":"my-app-id"}}}],"message":{"name":"lightMeasured","title":"Light measured","contentType":"application/json","traits":[{"headers":{"$ref":"#/components/schemas/schema-1"}}],"payload":{"type":"object","properties":{"lumens":{"type":"integer","minimum":0},"sentAt":{"$ref":"#/components/schemas/sentAt"}}}}}},"smartylighting/action/{streetlightId}/turn/on":{"parameters":{"streetlightId":{"$ref":"#/components/parameters/parameter-1"}},"publish":{"operationId":"turnOn","traits":[{"bindings":{"kafka":{"clientId":"my-app-id"}}}],"message":{"name":"turnOnOff","title":"Turn on/off","traits":[{"headers":{"$ref":"#/components/schemas/schema-1"}}],"payload":{"type":"object","properties":{"sentAt":{"$ref":"#/components/schemas/sentAt"}}}}}}},"components":{"schemas":{"sentAt":{"type":"string","format":"date-time"},"schema-2":{"type":"integer","minimum":0,"maximum":100},"schema-1":{"type":"object","properties":{"my-app-header":{"$ref":"#/components/schemas/schema-2"}}}},"parameters":{"parameter-1":{"schema":{"type":"string"}}}}}';
