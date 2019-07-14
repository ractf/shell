import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaLink } from "react-icons/fa";

import { SectionTitle, SectionH2, SectionHeading, TextBlock } from "../../../components/Misc";
import ListPage from "./ListPage";


const OverviewWrap = styled.div`
    flex-grow: 1;
    width: 100%;
`;

const FaLinkIcon = styled(FaLink)`
    font-size: .5em;
    color: #fff;
    margin-left: .4em;

    :hover {
        color: #ddd;
    }
`;

const LinkIcon = (props) => {
    if (!props.website) return null;

return <Link to={props.website}>
        <FaLinkIcon />
    </Link>;
};

export default (props) =>
    <OverviewWrap>
        <SectionTitle>{props.title}<LinkIcon website={props.website} /></SectionTitle>
        {props.underTitle
            ? <SectionHeading>69th Place</SectionHeading>
            : null}
        {props.description
            ? <TextBlock>{props.description}</TextBlock>
            : null}

        {props.sections.map(i => (
            <>
                <SectionH2>{i[0]}</SectionH2>
                <ListPage columns={i[1]} data={i[2]} />
            </>
        ))}
    </OverviewWrap>;
