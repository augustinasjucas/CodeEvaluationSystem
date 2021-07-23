import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import CodeInputBox from './CodeInputBox.js'
import SubmissionsList from './SubmissionsList.js'
import MathJax from 'mathjax3-react';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const TaskDisplay = (props) => {

    const [currentTaskOnScreen, changeCurrentTaskOnScreen] = useState('');
    const [testResult, setTestResult] = useState('');
    const [statement, changeStatement] = useState('Loading');
    const [haveToUpdateSubmissions, changeHaveToUpdateSubmissions] = useState(true);

    // converts all \n to <br /> in the statement
    const escapedNewLineToLineBreakTag = (string) => {
        return string;
        return string.split('\n').map((item, index) => {
            return (index === 0) ? item : [<br key={index} />, item]
        }).join()
    }

    // asks if submission was evaluated every 200s
    const checkForResult = () => {
        changeHaveToUpdateSubmissions(true);
    };
    useEffect(() => {
        setInterval(checkForResult, 3000);                                      // TODO: change this (probably)
    }, []);

    // submits code and starts checking for evaluation
    const onSubmitOfCode = (code) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.submitCode(code, currentTaskOnScreen, username, password).then((data) => {
        });
    };

    // gets all data of the task from server: TL, ML, statement, etc.
    const getTaskData = (taskName) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.getTaskData(taskName, username, password).then((data) => {
            data.statement += '\n\nLaiko limitas: ' + data.timeLimit + 'ms\n\nAtminties limitas: ' + data.memoryLimit + 'MB\n';
            changeStatement(escapedNewLineToLineBreakTag(data.statement));
        });

    };
    useEffect(() => {
        if(props.TaskName != '' && currentTaskOnScreen != props.TaskName){
            changeCurrentTaskOnScreen(props.TaskName);
            getTaskData(props.TaskName);
        }
    });
    // if some task is on the screen
    //                 <MathJax.Formula className="statementHolder" formula={parse(statement)} />
    if(props.TaskName != ''){
        return (
            <div className="taskDisplay">
                <br />
                <MathJax.Provider
                    options={{
                      tex: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']]
                      }
                    }}
                    input="tex"
                >
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} >
                        {statement}
                    </ReactMarkdown>
                </MathJax.Provider>
                <CodeInputBox placeholder='input the code!' onSubmit={onSubmitOfCode}/>
                <SubmissionsList Cookies={props.Cookies} TaskName={currentTaskOnScreen} HaveToUpdate={haveToUpdateSubmissions} ChangeHaveToUpdate={changeHaveToUpdateSubmissions}/>
            </div>
          );

    // if no task is on the screen:
    }else{
        return (
            <div>
            </div>
        );
    }

}

export default TaskDisplay;
