import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Button, { ButtonRow } from "./Button";


const TabButtonRow = styled(ButtonRow)`
    justify-content: ${props => props.center ? "center" : "flex-start"};

    >button {
        border-radius: 0;
        margin: 0;
        min-width: 100px;
        opacity: .5;
        transition: none;
        font-size: 1.1em;
    }
    >button:active {
        outline: none;
    }

    >button:first-child {
        border-radius: 2px 0 0 0px;
    }

    >button:last-child {
        border-radius: 0 2px 0px 0;
    }

    >button.active {
        opacity: 1;
    }
`;
const TabWrap = styled.div`
    border: 1px solid #373354;
    padding: 32px;
    width: 100%;

    background-color: #2c2a4455;
    padding: 1em 2em;
    border-radius: 2px;
    margin-top: -1px;
    min-height: 300px;
`;

export default ({ center, children, callback, initial }) => {
    const [active, setActive] = useState(initial || 0);

    useEffect(() => {
        if (callback) callback(active);
    });

    return (
        <>
            <TabButtonRow center={center}>
                {children.map((c, i) =>
                    <Button key={i} click={(() => { active !== i && setActive(i) })} medium
                        className={i === active ? "active" : ""}>
                        {c.props.label}</Button>)}
            </TabButtonRow>
            <TabWrap>
                {children[active]}
            </TabWrap>
        </>
    )
}
