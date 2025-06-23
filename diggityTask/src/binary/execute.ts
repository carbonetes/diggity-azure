import { exec, ExecOptions } from 'child_process';
import { exit } from 'process';
import { Styles, Common, Strings } from '../../styles'

export function executeCommand(
    command: string,
    failedSeverity: string,
    failureMessage: string,
    skipBuildFail: string
): void {
    // Extract the binary path (first word in command)
    const [binaryRelativePath, ...restArgs] = command.split(' ');

    // Check for invalid binary path (e.g., starts with a dash)
    if (!binaryRelativePath || binaryRelativePath.startsWith('-')) {
        console.error(`${failureMessage}: invalid binary path '${binaryRelativePath}'`);
        exit(1);
    }

    // Use the binary name directly, let the shell resolve it from PATH
    const binaryPath = binaryRelativePath;

    // Build the command string with the binary name
    const fullCommand = [binaryPath, ...restArgs].join(' ');

    const execOptions: ExecOptions = {
        cwd: '.', // or another directory if needed
        maxBuffer: 1024 * 1024 * 250, // 250MB
        shell: '/bin/bash',
    };

    const childProcess = exec(fullCommand, execOptions);
    childProcess.stdout?.on('data', (data) => {
        const log = data.toString().trim();
        console.log(log);
    });

    childProcess.stderr?.on('data', (data) => {
        const log = data.toString().trim();
        console.error(log);
    });

    childProcess.on('error', (error) => {
        console.error(`Error running command: ${error.message}`);
        exit(1);
    });
    childProcess.on('exit', (code) => {
        let exitStatus = 0;
        console.log("***Checking Skip Build Fail: " + skipBuildFail);
        if (code === 0) {
            console.log(
                Styles.FgGreen +
                Styles.Bold  +
                Strings.DIGGITYASSESSMENT +
                Common.PASSED +
                Styles.Reset
            );
            exit(0);
        } else {
            // Display fail
            console.error(
                Styles.FgRed +
                Styles.Bold +
                Strings.DIGGITYASSESSMENT +
                Common.FAILED +
                Common.NEXTLINE +
                Strings.FAILCRITERIA +
                failedSeverity +
                Common.NEXTLINE +
                Strings.RECOMMENDATION +
                Styles.Reset
            );
            exitStatus = 1;

            if (skipBuildFail == "true") {
                console.log(
                    Styles.FgCyan +
                    Styles.Bold +
                    Strings.NOTE +
                    Strings.SKIPFAILBUILD +
                    Styles.Reset
                );
                exitStatus = 0;
            }
        }
        exit(exitStatus);
    });
}