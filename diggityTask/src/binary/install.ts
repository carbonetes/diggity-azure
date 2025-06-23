import { exec } from 'child_process';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const binaryUrl = 'https://github.com/carbonetes/diggity/releases/latest/download/diggity';
        const binaryPath = '/usr/local/bin/diggity';
        const command = `
            sudo curl -sSL -o "${binaryPath}" "${binaryUrl}" && \
            sudo chmod +x "${binaryPath}"
        `;
        const installProcess = exec(command, { shell: '/bin/bash' });

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