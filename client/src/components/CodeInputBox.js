import React, { useState } from 'react';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/themes/prism.css"; //Example style, you can use another
const CodeInputBox = ({placeholder, onSubmit}) => {


    const [code, changeCode] = useState(placeholder);
    const onClick = () => {                                                 // when the button is clicked, onSubmit (in
        onSubmit(code);                                                     // App.js) is called with the current code
    }
    return (
        <div>
            <Editor
                value={code}
                onValueChange={(code) => changeCode(code)}
                highlight={(code) => highlight(code, languages.c)}
                padding={10}
                style={{
                    border: "1px solid black",
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,}}
            />
            <br />
            <button onClick={onClick}>Submit</button>
        </div>
      );
}

CodeInputBox.defaultProps = {                                               // if no placeholder is passed, it will be
    placeholder: 'Nėra pradinio kodo!',                                     // that.
};

export default CodeInputBox;
