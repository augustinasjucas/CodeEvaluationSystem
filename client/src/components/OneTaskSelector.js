import React from 'react';
import { Link } from 'react-router-dom'

const OneTaskSelector = (props) => {
    console.log('one task selector : ');
    console.log(props);
    return (
        <tr className="oneTaskSelectorRow">
            <td className={"oneTaskSelectorCol" + (props.Task.score == 100 ? ' solved' : '')}><Link to={'/task/' + props.Task.id} > {props.Task.name} </Link></td>
        </tr>
    );

}
export default OneTaskSelector;
