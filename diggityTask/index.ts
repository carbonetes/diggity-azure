import { setArguments } from './src/binary/arguments/setArguments';
import { runScript  } from './src/binary/install/install';

runScript()
    .catch((error) => {
        console.error('Failed to download and execute install shell script:', error);
        failBuild('Failed to download and execute install shell script');
    })
    .then(() => {
        runDiggity();
    });


function runDiggity() {
    setArguments()
        .catch((error) => {
            console.error('Error executing Diggity command:', error);
            failBuild('Failed to execute Diggity command');
        })
}

function failBuild(errorMessage: string) {
    console.error(errorMessage);
    process.exit(1);
}
