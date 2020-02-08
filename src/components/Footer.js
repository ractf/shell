import React from "react";
import { Link } from "react-router-dom";

import "./Footer.scss";


const FootCol = (props) => (
    <div className={props.right ? "right" : ""}>
        {props.title
            ? <div className={"head"}>{props.title}</div>
            : null}
        {props.children}
    </div>
);

const FootLink = (props) => <p><Link to={props.to}>{props.children}</Link></p>;


export default () => {
    return <footer>
        <FootCol title={"RACTF"}>
            <FootLink to={"/about"}>About</FootLink>
            <FootLink to={"/conduct"}>Code of Conduct</FootLink>
            <FootLink to={"/privacy"}>Privacy Policy</FootLink>
        </FootCol>
        <FootCol title={"Social"}>
            <p><a href={"https://discord.gg/FfW2xXR"}>Discord</a></p>
        </FootCol>
        <FootCol right>
            <p>&copy; 2019 RACTF Team</p>
            <p>Built by RACTF, for RACTF</p>
        </FootCol>
    </footer>;
};
