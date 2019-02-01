import React, {Component} from "react";

import './Menu.css';
import MenuIcon from './MenuIcon.svg'

export default class Menu extends Component {
    render(): React.ReactNode {
        return <div className={"Menu"}>
            <img src={MenuIcon} alt={"Menu"}/>
        </div>;
    }
}
