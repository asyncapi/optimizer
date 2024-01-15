// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Optimizer } = require('../lib/Optimizer')

// read input.yaml file synconously and store it as an string
const input = require('fs').readFileSync('./examples/input.yaml', 'utf8')
const optimizer = new Optimizer(input)
optimizer.getReport().then((report) => {
  console.log(report)
  const optimizedDocument = optimizer.getOptimizedDocument({
    output: 'YAML',
    rules: {
      reuseComponents: true,
      removeComponents: true,
      moveToComponents: true,
    },
  })
  //store optimizedDocument as to output.yaml
  require('fs').writeFileSync('./examples/output.yaml', optimizedDocument)
})
