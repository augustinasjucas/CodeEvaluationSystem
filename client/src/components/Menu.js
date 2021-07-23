import React from 'react';
import { Link } from 'react-router-dom';

const Menu = (props) => {

    return (
        <table className="menuTable">
            <tr className="menuRow">
                <td className="menuHome"> <Link className="homeLinkWord" to='/'> Home </Link> </td>
                <td className="menuMiddleSpace"> SistemaAA  </td>
                <td className="menuUsername"> {props.Username} </td>
                <td className="menuLogout"> <a onClick={props.Logout} className="logoutButton"> Logout </a> </td>
            </tr>
        </table>
    );

}
           // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.message}</td>
            // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.points} / 1</td>

export default Menu;
