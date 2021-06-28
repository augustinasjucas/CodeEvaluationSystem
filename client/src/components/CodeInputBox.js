import React from "react";

const CodeInputBox = ({placeholder, onSubmit}) => {
    let code = placeholder;

    const onChange = (e) => {
        code = e.target.value;
    }
    const onClick = () => {                                                 // when the button is clicked, onSubmit (in
        onSubmit(code);                                                     // App.js) is called with the current code
    }
    return (
        <div className="App">
            <textarea onChange= {onChange}>{placeholder}</textarea>
            <button onClick={onClick}>Submit</button>
        </div>
      );
}

CodeInputBox.defaultProps = {                                               // if no placeholder is passed, it will be
    placeholder: 'Nėra pradinio kodo!',                                     // that.
};

export default CodeInputBox;