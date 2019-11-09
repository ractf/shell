import React from "react";

import "./Style.scss";


export default ({ popup }) => <div className={"basePopupWrap"}>
    <div>{ popup.title }</div>
    <div>{ popup.body }</div>
</div>;
