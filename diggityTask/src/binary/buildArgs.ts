import { executeCommand } from "./execute";
import input = require("azure-pipelines-task-lib");

const DIGGITY = "diggity"; // The installed binary name
const FAILCRITERIA = "--fail-criteria";
const DIR = "--dir";
const TAR = "--tar";
const CIMODE = "--ci";
const TOKEN = "--token";
const PLUGIN = "--plugin"; 

// Function to run the 'diggity' command
export async function runDiggityCommand() {

    // Inputs
    const inputs = {
        token: input.getInput("token", true) || "",
        scanType: input.getInput("scanType", true) || "",
        scanName: input.getInput("scanName", true) || "",
        failCriteria: input.getInput("failCriteria", true) || "",
        skipDbUpdate: Boolean(input.getInput("skipDbUpdate", false)),
        skipBuildFail: input.getInput("skipBuildFail", true) || "",
    };

    console.log("Checking Skip Build Fail: ", inputs.skipBuildFail);

    const args: string[] = [];
    let command: string | undefined;

    // CI MODE
    args.push(CIMODE);
    args.push(TOKEN);
    args.push(inputs.token);
    args.push(PLUGIN);
    args.push("azure");

    if (args.length > 0) {

        // Scan Type
        switch (inputs.scanType) {
            case 'image':
                // Handle image scan case
                console.log('Performing image scan');
                args.push(inputs.scanName);
                break;
            case 'tar':
                // Handle tar scan case
                console.log('Performing tar scan');
                args.push(TAR);
                args.push(inputs.scanName);
                break;
            case 'directory':
                // Handle directory scan case
                console.log('Performing directory scan');
                args.push(DIR);
                args.push(inputs.scanName);
                break;
            default:
                // Handle image scan case
                console.log('Performing image scan');
                args.push(inputs.scanName);
                break;
        }

        args.push(FAILCRITERIA);
        args.push(inputs.failCriteria);
        // Join all arguments and prepend the binary
        command = [DIGGITY, ...args].join(' ');
        console.log("Diggity Command: ", command); // 
    } else {
        console.log("Error generating arguments");
        return;
    }

    let failedSeverity = inputs.failCriteria;
    let skipBuildFail = inputs.skipBuildFail;
    let failureMessage = `Error running '${DIGGITY}' command`;

    try {
        executeCommand(command, failedSeverity, failureMessage, skipBuildFail);
    } catch (error) {
        return error;
    }
}