import React, { Component } from "react";
import styled from "styled-components";

import { APIContext } from "../controllers/API";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { HR, TextBlock, SectionTitle, SectionTitle2, CTFContainer } from "../../components/Misc";


const ChalWorth = styled.div`
    margin-top: .5em;
    font-size: 1rem;
`;
const ChalMeta = styled.div`
    margin-top: 8px;
    font-size: .8em;
    margin-bottom: 2em;
`;

export default class ChallengePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            flag: "",
            flagValid: false,
        }

        this.regex = /^ractf{.+?}$/;
        this.partial = /^(?:r|$)(?:a|$)(?:c|$)(?:t|$)(?:f|$)(?:{|$)(?:[^}]+?|$)(?:}|$)$/;
    }

    setFlag = (flag) => {
        this.setState({ flag: flag, flagValid: this.regex.test(flag) });
    }

    render() {
        return <APIContext.Consumer>{api => <CTFContainer>
            {(this.challenge = api.getChallenge(this.props.match.params.category, this.props.match.params.challenge)) && ""}

            <SectionTitle>Challenge Name</SectionTitle>
            <SectionTitle2>Challenge 1</SectionTitle2>
            <ChalWorth>150 Points</ChalWorth>

            <ChalMeta>
                12 people have solved this challenge.<br />
                First solved by Xela
                </ChalMeta>

            <TextBlock dangerouslySetInnerHTML={{ __html: this.challenge.description }} />

            <Input callback={this.setFlag}
                placeholder="Flag format: ractf{...}"
                format={this.partial}
                center width={"80%"} />
            <Button disabled={!this.state.flagValid}>Attempt flag</Button>
            <Button>Get hint</Button>


            <HR />
            <Button to={"."}>Back</Button>
        </CTFContainer>}</APIContext.Consumer>;
    }
}

export class CampaignChallengePage extends ChallengePage {
    constructor(props) {
        super(props);
        this.props.match.params.category = "campaign";
    }
}
