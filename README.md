# Thread dump analyzer for java applications

It allows analyzing multiple thread dumps in order to get information about what is going on with application.

Typical scenario is: 
1) You have performance issue and where to find where it is;
2) You collect some number of thread dumps (for example 12) of your java application with some interval (for example 5 seconds);
3) You run this tool just to group threads by thread name and stack trace. So if some thread is stack with something during 60 seconds (12 * 5) it will be present in result numberOfElementsInGroup = 12 in this cass.
4) Then you can investigate the thread stacktrace and check if it's really okay for hit to spent 60 seconds in that place.

# How to run:

1. Clone the repo;
2. Install nodejs (recommended is v19.5.0 or higher);
3. Open command line and navigate to the project root folder and run:
```
npm ci
```
4. Now you are ready to use the app, it can be done by command:
```
node analyzer_cmd_adapter.js --folderPath="${PATH_TO_FOLDER_WITH_DUMP_FILES}" >> result.txt
```
Notes: 
- please replace ${PATH_TO_FOLDER_WITH_DUMP_FILES} with real path to folder with thread dump files!
- result will be written to `result.txt` in the root folder of the application.