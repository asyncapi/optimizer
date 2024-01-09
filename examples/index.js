// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Optimizer } = require('../lib/Optimizer')

// read input.yaml file synconously and store it as an string
const input = require('fs').readFileSync('./examples/input.yaml', 'utf8')
const optimizer = new Optimizer(input)
optimizer.getReport().then((report) => {
  console.log(JSON.stringify(report))
  const optimizedDocument = optimizer.getOptimizedDocument({
    output: 'YAML',
    rules: {
      reuseComponents: true,
      removeComponents: true,
      moveDuplicatesToComponents: true,
    },
  })
  //store optimizedDocument as to output.yaml
  require('fs').writeFileSync('./examples/output.yaml', optimizedDocument)
})
