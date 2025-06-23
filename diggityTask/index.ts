import { runDiggityCommand } from './src/binary/buildArgs'
import { runScript } from './src/binary/install'

runScript()
.catch((error) => {
    console.error('Failed to download and execute diggity binary: ', error)
    failBuild('Failed to download and execute diggity binary')
})
.then(() => {
    runDiggity();
})

function runDiggity() {
    runDiggityCommand()
    .catch((error) => {
        console.error('Error executing diggity command: ', error)
        failBuild('Error executing diggity command')
    })
}

function failBuild(errorMessage: string) {
    console.error(errorMessage)
    process.exit(1)
}