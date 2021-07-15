import React, { useState } from 'react';

const CodeInputBox = ({placeholder, onSubmit}) => {


    const [code, changeCode] = useState(placeholder);
    const onChange = (e) => {
        changeCode(e.target.value);
    }
    const onClick = () => {                                                 // when the button is clicked, onSubmit (in
        onSubmit(code);                                                     // App.js) is called with the current code
    }
    return (
        <div className="App">
            <textarea rows='40' cols='80' onChange= {onChange}>{placeholder}</textarea>
            <br />
            <button onClick={onClick}>Submit</button>
        </div>
      );
}

CodeInputBox.defaultProps = {                                               // if no placeholder is passed, it will be
    placeholder: 'Nėra pradinio kodo!',                                     // that.
};

export default CodeInputBox;
