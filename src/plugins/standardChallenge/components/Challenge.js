import React, { useState, useContext, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from 'react-i18next';

import {
    Button, Input, TextBlock, Form, FormError, SBTSection, Link, FlexRow,
    FlashText
} from "@ractf/ui-kit";
import { appContext, apiEndpoints, apiContext, plugins } from "ractf";

import Split from "./Split";
import File from "./File";
import Hint from "./Hint";

import "./Challenge.scss";


export default ({ challenge, category, rightComponent }) => {
    const [flagValid, setFlagValid] = useState(false);
    const [message, setMessage] = useState(null);
    const [locked, setLocked] = useState(false);
    const onFlagResponse = useRef();

    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const api = useContext(apiContext);

    const { t } = useTranslation();

    const escape = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flagRegex = () => {
        let regex = challenge.challenge_metadata.flag_regex;
        let partial = challenge.challenge_metadata.flag_partial_regex;
        let prefix = api.configGet("flag_prefix") || "flag";
        if (!regex || !partial) {
            regex = new RegExp("^" + escape(prefix) + "{.+}$");
            partial = "";
            for (let i = 0; i < prefix.length; i++) {
                partial += "(?:" + escape(prefix[i]) + "|$)";
            }
            partial = new RegExp("^" + partial + "(?:{|$)(?:[^}]+|$)(?:}|$)$");
        }
        return [regex, partial];
    };
    const [regex, partial] = flagRegex();
    
    const changeFlag = (flag) => {
        if (challenge.challenge_type === "freeform" || challenge.challenge_type === "longText")
            return setFlagValid(!!flag);
        setFlagValid(regex.test(flag));
    };

    const promptHint = (hint) => {
        return () => {
            if (hint.used) return app.alert(hint.name + ":\n" + hint.text);

            let msg = <>
                Are you sure you want to use a hint?<br /><br />
                This hint will deduct {hint.penalty} points from this challenge.
            </>;
            app.promptConfirm({ message: msg, small: true }).then(() => {
                endpoints.useHint(hint.id).then(body =>
                    app.alert(hint.name + ":\n" + body.text)
                ).catch(e =>
                    app.alert("Error using hint:\n" + endpoints.getError(e))
                );
            }).catch(() => { });
        };
    };

    const tryFlag = challenge => {
        return ({ flag }) => {
            setLocked(true);
            endpoints.attemptFlag(flag, challenge).then(resp => {
                if (resp.d.correct) {
                    app.alert("Flag correct!");
                    if (onFlagResponse.current)
                        onFlagResponse.current(true);
                    challenge.solved = true;

                    // NOTE: This is potentially very slow. If there are performance issues in production, this is
                    // where to look first!
                    endpoints._reloadCache();
                    /*  // This is the start of what would be the code to rebuild the local cache
                    api.challenges.forEach(group => group.chals.forEach(chal => {
                        if (chal.deps.indexOf(challenge.id) !== -1) {
                            chal.lock = false;
                        }
                    }));
                    */
                } else {
                    app.alert("Incorrect flag");
                }
                setLocked(false);
            }).catch(e => {
                setMessage(endpoints.getError(e));
                if (onFlagResponse.current)
                    onFlagResponse.current(false, endpoints.getError(e));
                setLocked(false);
            });
        };
    };

    let flagInput = null;
    switch (challenge.challenge_type) {
        case "code":
            break;
        case "map":
            break;
        case "freeform":
            flagInput = <Input placeholder="Flag"
                name={"flag"} onChange={changeFlag}
                light monospace
                center width={"80%"} />;
            break;
        case "longText":
            flagInput = <Input rows={5} placeholder="Flag text"
                format={partial} name={"flag"}
                onChange={changeFlag} light monospace
                center width={"80%"} />;
            break;
        default:
            flagInput = <Input placeholder="Flag format: ractf{...}"
                format={partial} name={"flag"}
                onChange={changeFlag} light monospace
                center width={"80%"} />;
            break;
    }

    let challengeMods = [];
    Object.keys(plugins.challengeMod).forEach(key => {
        let i = plugins.challengeMod[key];
        if (!i.check || i.check(challenge, category)) {
            challengeMods.push(React.createElement(i.component, {
                challenge: challenge, category: category, key: key,
            }));
        }
    });

    let rightSide = null;
    if (rightComponent)
        rightSide = React.createElement(rightComponent, { challenge: challenge });

    let chalContent = <>
        {challengeMods}
        <TextBlock className={"challengeBrief"}>
            <ReactMarkdown
                source={challenge.description}
                renderers={{
                    link: ({ href, children }) => (
                        <a rel="noopener noreferrer" target="_blank" href={href}>{children}</a>
                    ),
                    delete: ({ children }) => <span className="redacted">{children}</span>
                }}
            />
        </TextBlock>

        {challenge.files && !!challenge.files.length && <div className={"challengeLinkGroup"}>
            {challenge.files.map(file =>
                file && <File name={file.name} url={file.url} size={file.size} key={file.id} id={file.id} />
            )}
        </div>}
        {api.user.team && challenge.hints && !!challenge.hints.length && <div className={"challengeLinkGroup"}>
            {challenge.hints && !challenge.solved && challenge.hints.map((hint, n) => {
                return <Hint name={hint.name} onClick={promptHint(hint)} hintUsed={hint.used}
                    points={hint.penalty} id={hint.id} key={hint.id} />;
            })}
        </div>}
        
        {challenge.solved ? <>
            {t("challenge.already_solved")}
        </> : api.user.team ? <Form handle={tryFlag(challenge)} locked={locked}>
            {flagInput && <>
                {flagInput}
                {message && <FormError>{message}</FormError>}
                <FlexRow>
                    <Button disabled={!flagValid} submit>{t("challenge.attempt")}</Button>
                </FlexRow>
            </>}
        </Form> : <FlashText warning bold>
            {t("challenge.no_team")}
            <FlexRow>
                <Button to={"/team/new"}>{t("join_a_team")}</Button>
                <Button to={"/team/new"}>{t("create_a_team")}</Button>
            </FlexRow>
        </FlashText>}
    </>;

    let tags = <>
        <div className={"challengeTag"}>{category.name}</div>
        <div className={"challengeTag"}>{challenge.author}</div>
    </>;

    let solveMsg = (challenge.first_blood_name
        ? t("challenge.first_solve", { name: challenge.first_blood_name })
        : t("challenge.no_solve"));

    return <Split submitFlag={tryFlag(challenge)} onFlagResponse={onFlagResponse}>
        <SBTSection subTitle={<>{t("point_count", { count: challenge.score })} - {solveMsg}</>}
            back={<Link className={"backToChals"} to={".."}>{t("back_to_chal")}</Link>}
            title={<span className={"challengeTags"}><span>{challenge.name}</span>{tags}</span>}
        >
            {chalContent}
        </SBTSection>
        {rightSide}
    </Split>;
};
