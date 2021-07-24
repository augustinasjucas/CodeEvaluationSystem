# Important information

All tasks will be in the `server/tasks` folder. Every task has its own folder named after the id of the task.
In every task folder there must be:


1.  Statement file. For now let it be `statement.txt`. Contents of this file should be int .tex format, but also HTML is supported here.


2.  Tests folder. It should be called `tests`. In this folder there should be two other folders: `input` and `output` and each test should be `i.in` or `i.out`, where i is the index of the test. The tests here are numbered from `1` to `n`, but in `info.json` file numbering is from `0` to `n-1`, so `1.in` corresponds to the number `0` there. 


3.  A file with additional info, such as the name of the task, time limit etc. The file should be called `info.json`. In this file there should be these things: `time_limit` (integer, measured in milliseconds), `name` (string, the name of the task), `tests` (integer, the total number of tests), `subtasks` (an array, where `subtasks[i]` is an object which has two properties: `subtasks[i].points` (integer), which denotes the fraction of points for this subtask and `subtask[i].tests`, which is an array of numbers, denoting the names of the tests which are in this subtask. Number `0` here corresponds to the test `1.in/out`), `needsChecker` (boolean, true if task needs a checker)/


If a task needs a checker, it has to be a compiled file in `/tasks/taskName` directory and the file should be named `checker`.
The checker should take as input (from `stdin`) two strings (in this order): `file.in file.out` where `file.in` is the input test file and `file.out` is the output file that the solution produced. The checker must print to `stdout` only one number - the score of the test. 


The `server/submissionsFolder` is for storing the compiled codes and other temporary data when testing the programs.

