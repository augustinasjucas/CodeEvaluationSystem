import React from 'react';
import { Link } from 'react-router-dom'

const OneTaskSelector = (props) => {
    return (
        <tr className="oneTaskSelectorRow">
            <td className="oneTaskSelectorCol"><Link to={'/task/' + props.Task.id} > {props.Task.name} </Link></td>
        </tr>
    );

}
export default OneTaskSelector;
