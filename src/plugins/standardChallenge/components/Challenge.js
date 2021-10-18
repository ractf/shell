// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { iteratePlugins, FlagForm } from "@ractf/plugins";
import {
    Button, TextBlock, PageHead, Markdown, Badge, Page, Card, Container
} from "@ractf/ui-kit";

import Link from "components/Link";

import Split from "./Split";
import File from "./File";
import Hint from "./Hint";

import "./Challenge.scss";


export default ({ challenge, category, embedded, rightComponent }) => {
    const onFlagResponse = useRef();
    const submitFlag = useRef();

    const user = useSelector(state => state.user);

    const { t } = useTranslation();

    const challengeMods = [];
    iteratePlugins("challengeMod").forEach(({ key, plugin }) => {
        if (!plugin.check || plugin.check(challenge, category)) {
            challengeMods.push(React.createElement(plugin.component, {
                challenge, category, embedded, key,
            }));
        }
    });

    let rightSide = null;
    if (rightComponent)
        rightSide = React.createElement(rightComponent, { challenge: challenge });

    const chalContent = <>
        {challengeMods}
        <TextBlock>
            <Markdown LinkElem={Link} source={challenge.description} />
        </TextBlock>

        {challenge.files && !!challenge.files.length && <Container full toolbar spaced>
            {challenge.files.map(file => file && (
                <File key={file.id} {...file} tiny />
            ))}
        </Container>}
        {user.team && challenge.hints && !!challenge.hints.length && <Container full toolbar spaced>
            {challenge.hints && !challenge.solved && challenge.hints.map((hint, n) => {
                return <Hint {...hint} key={hint.id} tiny />;
            })}
        </Container>}

        {challenge.solved && challenge.post_score_explanation && (
            <Card lesser header={t("challenge.post_score_explanation")}>
                <Markdown LinkElem={Link} source={challenge.post_score_explanation} />
            </Card>
        )}
        {user.team
            ? (<>
                <FlagForm challenge={challenge} submitRef={submitFlag}
                    onFlagResponse={onFlagResponse.current} autoFocus={!embedded} />
                {embedded && (
                    <Link to={challenge.url}>
                        <Button>Open challenge page</Button>
                    </Link>
                )}
            </>) : (<>
                <Card slim danger>{t("challenge.no_team")}</Card>
                <Link to={"/team/join"}>
                    <Button danger>{t("join_a_team")}</Button>
                </Link>
                <Link to={"/team/create"}>
                    <Button danger>{t("create_a_team")}</Button>
                </Link>
            </>)
        }
    </>;

    const tags = challenge.tags.map((i, n) => <Badge key={n} pill primary>{i}</Badge>);

    const solveMsg = (challenge.first_blood
        ? t("challenge.has_solve", { name: challenge.first_blood, count: challenge.solve_count })
        : t("challenge.no_solve"));
    const votesMessage = ((challenge.votes.positive || challenge.votes.negative)
        ? t("challenge.votes", {
            percentage: Math.round(
                (challenge.votes.positive / (challenge.votes.positive + challenge.votes.negative)) * 1000
            ) / 10
        })
        : t("challenge.no_votes")
    );

    if (embedded) {
        if (!rightSide) return chalContent;
        return (
            <Split submitFlag={submitFlag} onFlagResponse={onFlagResponse} stacked>
                {chalContent}
                {rightSide}
            </Split>
        );
    }

    const leftSide = <Page>
        <PageHead
            subTitle={<>{t("point_count", { count: challenge.score })} - {solveMsg} - {votesMessage}</>}
            back={<Link className={"backToChals"} to={challenge.category.url}>
                {t("back_to_chal")}
            </Link>}
            title={challenge.name} tags={tags}
        />
        {user.is_staff && (
            <div style={{ position: "absolute", top: 16, right: 32 }} right>
                <Link to={"#edit"}>
                    <Button danger>{t("edit")}</Button>
                </Link>
            </div>
        )}
        {chalContent}
    </Page>;

    if (!rightSide) return leftSide;

    return <Page title={challenge ? challenge.name : "Challenges"} noWrap={!!rightSide}>
        <Split submitFlag={submitFlag} onFlagResponse={onFlagResponse}>
            {leftSide}
            {rightSide}
        </Split>
    </Page>;
};
