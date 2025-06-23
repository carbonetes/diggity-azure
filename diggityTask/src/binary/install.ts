import { exec } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const homeDir = homedir();
        const binaryUrl = 'https://github.com/carbonetes/diggity/releases/latest/download/diggity';
        const binaryPath = join(homeDir, 'diggity');
        const command = `
            curl -sSL -o "${binaryPath}" "${binaryUrl}" && \
            chmod +x "${binaryPath}"
        `;
        const installProcess = exec(command, { shell: '/bin/bash' });

        // Do not show stdout/stderr logs

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Diggity binary downloaded and made executable successfully');
                resolve();
            } else {
                const errorMessage = `Error downloading Diggity binary. Exit code: ${code}, Signal: ${signal}`;
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