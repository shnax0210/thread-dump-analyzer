const fs = require('fs');
const path = require('path');

const EMPTY_NEW_LINE_PATTER = /\r?\n\s*\r?\n/;
const THREAD_NAME_PATTERN = /".+"\s/;
const STACK_TRACE_PATTERN = /java\.lang\.Thread\.State(.|\r?\n)*/;

function createFileObject(folderPath, fileName) {
    return {
        name: fileName,
        content: fs.readFileSync(path.join(folderPath, fileName), 'utf8')
    }
}

function readFilesSync(folderPath) {
    return fs.readdirSync(folderPath).map(fileName => createFileObject(folderPath, fileName));
}

function hasStackTrace(str) {
    return STACK_TRACE_PATTERN.test(str);
}

function parseThreadLines(dump) {
    return dump.split(EMPTY_NEW_LINE_PATTER).filter(hasStackTrace);
}

function parseFirstPatternMatch(str, patter) {
    const match = patter.exec(str);

    if (!match) {
        throw new Error(`No matches by pattern: ${patter} in: ${str}`);
    }

    return match[0];
}

function parseThread(threadLine) {
    return {
        name: parseFirstPatternMatch(threadLine, THREAD_NAME_PATTERN).trim(),
        stackTrace: parseFirstPatternMatch(threadLine, STACK_TRACE_PATTERN).trim()
    }
}

function parseThreads(dump) {
    return parseThreadLines(dump).map(parseThread);
}

function collectThreadsData(path) {
    return readFilesSync(path)
        .flatMap(dumpFile => parseThreads(dumpFile.content)
            .map(thread => {
                return {
                    fileName: dumpFile.name,
                    threadName: thread.name,
                    stackTrace: thread.stackTrace
                }
            })
        )
}

function groupThreadsData(list, config) {
    function buildGroupKey(item) {
        return config.groupingFields.map(groupField => item[groupField]).toString()
    }

    const groupValueToGroup = list.reduce((groups, item) => {
        const groupKey = buildGroupKey(item)
        return {
            ...groups,
            [groupKey]: [...(groups[groupKey] || []), item]
        }
    }, {});

    return Object.keys(groupValueToGroup).map(groupValue => {
        const result = {
            groupingValue: groupValue,
            numberOfElementsInGroup: groupValueToGroup[groupValue].length
        };

        if (config.addGroupElementsToResult) {
            result.groupedElemets = groupValueToGroup[groupValue]
        }

        return result
    }).sort((e1, e2) => e2.numberOfElementsInGroup - e1.numberOfElementsInGroup);
}

function analyze(config) {
    return groupThreadsData(collectThreadsData(config.folderPath), config);
}

exports.analyze = analyze