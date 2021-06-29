# Important information

All tasks will be in the `tasks` folder. Every task has its own folder named after the id of the task.
In every task folder there must be:


1. Statement file. For now let it be `statement.txt`.


2. Tests folder. It should be called `tests`. In this folder there should be two other folders: `input` and `output` and each test should be `00i.in` or `00i.out`, where i is the index of the test.


3. A file with additional info, such as the name of the task, time limit etc. The file should be called `info.json`. In this file there should be these things: `time_limit` (integer, measured in milliseconds), `name` (string, the name of the task), `subtasks` (an array, where `subtasks[i]` is an object which has two properties: `subtasks[i].points` (integer), which denotes the fraction of points for this subtask and `subtask[i].tests`, which is an array of strings, denoting the names of the tests which are in this subtask).
