import { exec } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const homeDir = homedir();
        const binaryPath = join(homeDir, 'diggity'); // Not used by the script, but kept for structure
        const command = `bash -c "$(curl -sSfL https://raw.githubusercontent.com/carbonetes/diggity/main/install.sh)"`;

        const installProcess = exec(command, { shell: '/bin/bash' });

        installProcess.stdout?.on('data', (data) => {
            console.log(`[install stdout] ${data.toString()}`);
        });
        installProcess.stderr?.on('data', (data) => {
            console.error(`[install stderr] ${data.toString()}`);
        });

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Diggity binary installed successfully');
                resolve();
            } else {
                const errorMessage = `Error installing Diggity binary. Exit code: ${code}, Signal: ${signal}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
        });
    });
}

export async function runScript(): Promise<void> {
    try {
        await executeScript();
    } catch (error) {
        console.error('Error running script:', error);
    }
}