import { exec } from 'child_process';
import * as path from 'path';

function executeScript(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        // Use the current working directory as the install directory
        const installDir = process.cwd();
        const diggityBinary = path.join(installDir, 'diggity');
        const command = `curl -sSfL https://raw.githubusercontent.com/carbonetes/diggity/main/install.sh | bash -s -- -d "${installDir}" && chmod +x "${diggityBinary}"`;

        console.log(`Installing Diggity to: ${diggityBinary}`);

        const installProcess = exec(command, { shell: '/bin/bash' });

        installProcess.stdout?.on('data', (data) => {
            console.log(`[install stdout] ${data.toString()}`);
        });
        installProcess.stderr?.on('data', (data) => {
            console.error(`[install stderr] ${data.toString()}`);
        });

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log(`Diggity binary installed successfully to: ${diggityBinary}`);
                resolve(diggityBinary);
            } else {
                const errorMessage = `Error installing Diggity binary. Exit code: ${code}, Signal: ${signal}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
        });
    });
}

export async function runScript(): Promise<string | undefined> {
    try {
        return await executeScript();
    } catch (error) {
        console.error('Error running script:', error);
        return undefined;
    }
}