// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Optimizer } = require('../lib/Optimizer')

const yaml = `
asyncapi: 3.0.0
info:
  title: Account Service
  version: 1.0.0
  description: This service is in charge of processing user signups
channels:
  user/signedup:
    address: user/signedup
    messages:
      subscribe.message:
        $ref: '#/components/messages/UserSignedUp'
operations:
  user/signedup.subscribe:
    action: send
    channel:
      $ref: '#/channels/user~1signedup'
    messages:
      - $ref: '#/components/messages/UserSignedUp'
components:
  messages:
    UserSignedUp:
      payload:
        type: object
        properties:
          displayName:
            type: string
            description: Name of the user
          email:
            type: string
            format: email
            description: Email of the user
    UserSignedUpV2:
      payload:
        type: object
        properties:
          displayName:
            type: string
            description: Name of the user
          email:
            type: string
            format: email
            description: Email of the user
`
const optimizer = new Optimizer(yaml)
optimizer.getReport().then((report) => {
  console.log(JSON.stringify(report))
  const optimizedDocument = optimizer.getOptimizedDocument({
    rules: {
      reuseComponents: true,
      removeComponents: true,
      moveToComponents: true,
    },
  })
  console.log(optimizedDocument)
})
