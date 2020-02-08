import React from "react";

import { plugins } from "ractf";

import "./Style.scss";


export default ({ popup }) => {
    const medal = plugins.medal[popup.medal];
    if (!medal) return <div className={"medalWrap"}>Unknown medal type '{popup.medal}'</div>;

    return <div className={"medalOuterWrap"}>
        <div className={"medalWrap"}>
            <div>{ medal.name }</div>
            <div>{ medal.description }</div>
        </div>
        <div className={"medalIcon"}>{ medal.icon }</div>
    </div>;
};
