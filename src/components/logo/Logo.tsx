import React, {Component} from "react";
import LogoImage from './Logo.png';
import './Logo.css'

export default class Logo extends Component {
    render(): React.ReactNode {
        return <img src={LogoImage} className={'Logo'} alt={"Logo"}/>
    }
}