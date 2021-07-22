import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import { useParams } from 'react-router-dom';
import TestViewer from './TestViewer.js'
import { CopyBlock, atomOneDark } from "react-code-blocks";
const ViewSubmission = (props) => {
    const [submissionOnScreen, changeSubmissionOnScreen] = useState(-1);
    const [result, changeResult] = useState({});

    var { id } = useParams();


    // downloads submission `id` from server
    const loadData = (id) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.getSubmissionData(id, username, password).then((data) => {
            changeResult(data);
        });
    };

    useEffect(() => {
        if(submissionOnScreen === id){
            return ;
        }
        changeSubmissionOnScreen(id);
        loadData(id);
    });
    if(Object.keys(result).length == 0){
        return (
            <div>
                Loading..
            </div>
        );
    }else{
        var resultPart;
        if(!result.compiled){
            resultPart = (<div>Compilation error: <br /> {JSON.stringify(result.result)} </div>);
        }else{
            resultPart = (<div> <TestViewer Tests={result.result} /> </div>)
        }
        return (
            <div>
                Compilation: {result.compiled ? 'good' : 'bad'}
                <br /><br />
                Code: <br />
                  <CopyBlock
                    text={result.code}
                    language={'cpp'}
                    showLineNumbers={true}
                    wrapLines
                    theme={atomOneDark}
                  />
                  <br />
                {resultPart}

            </div>
        );
    }
}

export default ViewSubmission;
