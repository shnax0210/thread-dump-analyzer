const yargs = require('yargs/yargs');
const {analyze} = require('./analyzer');

const argv = yargs(process.argv.slice(2))
    .option('folderPath', {
        alias: 'fp',
        description: 'Path to folder with java thread dump files',
        type: 'string'
    })
    .option('groupingFields', {
        alias: 'gf',
        description: 'Fields to group result. Available fields: fileName, threadName, stackTrace. Example of usage: --groupingField="threadName,stackTrace"',
        type: 'number'
    })
    .option('addGroupElementsToResult', {
        alias: 'ag',
        description: 'If true then elements that belong to each group will be printed in result',
        type: 'boolean'
    })
    .help()
    .alias('help', 'h').argv;

function parseGroupingFields(argv) {
    if (!argv.groupingFields) {
        return ["threadName", "stackTrace"];
    }

    return argv.groupingFields.split(",").trim()
}

const config = {};
config.folderPath = argv.folderPath;
config.groupingFields = parseGroupingFields(argv);
config.addGroupElementsToResult = argv.addGroupElementsToResult || false

console.log("----------------------------------------------------")
console.log("Starting analyzing with configs: " + JSON.stringify(config))
console.log("----------------------------------------------------")
analyze(config).forEach(obj => {
    console.log(obj)
})
console.log("----------------------------------------------------")
console.log("Finished analyzing")
console.log("----------------------------------------------------")