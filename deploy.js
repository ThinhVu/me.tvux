const child_process = require('child_process');
const packageJson = require('./package.json')
const {name, version} = packageJson
const buildDate = new Date().getTime()
const buildId = `${name}:${version}.${buildDate}`
const DOCKER_REGISTRY = 'registry.tvux.me'
const buildProcesses = [
  `docker build -t ${DOCKER_REGISTRY}/${buildId} .`,
  `docker push ${DOCKER_REGISTRY}/${buildId}`
]
const process = child_process.exec(buildProcesses.join(' && '))
process.stdout.on('data', console.log)
process.stderr.on('data', console.log)
process.on('exit', (code, signal) => {
  console.log('on exit', code, signal)
})
