import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { SectionTitle2 } from "../../components/Misc";
import useReactRouter from "../../useReactRouter";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import { plugins, Button, apiContext, Input, Form, FormError, SBTSection, appContext } from "ractf";

import "./Campaign.scss";


const ANC = ({ hide, anc, modal }) => {
    const api = useContext(apiContext);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState("");

    const create = ({ cname, cdesc, ctype }) => {
        if (!cname.length)
            return setError("No name provided!");
        if (!ctype.length || !plugins.categoryType[ctype])
            return setError("Invalid category type!\nValid types: " + Object.keys(plugins.categoryType).join(", "));

        setLocked(true);

        (anc.id ? api.editGroup(anc.id, cname, cdesc, ctype) : api.createGroup(cname, cdesc, ctype)).then(async resp => {
            await api.setup();
            if (hide)
                hide();
        }).catch(e => {
            setError(api.getError(e));
            setLocked(false);
        });
    };

    let body = <Form locked={locked} handle={create}>
        {modal && <SectionTitle2>{anc.id ? "Edit" : "Add new"} category</SectionTitle2>}
        <label htmlFor={"cname"}>Catgeory name</label>
        <Input val={anc.name} name={"cname"} placeholder={"Catgeory name"} />
        <label htmlFor={"cdesc"}>Catgeory brief</label>
        <Input val={anc.desc} name={"cdesc"} rows={5} placeholder={"Category brief"} />
        <label htmlFor={"ctype"}>Catgeory type</label>
        <Input val={anc.type} name={"ctype"} format={{ test: i => !!plugins.categoryType[i] }} placeholder={"Category type"} />
        {error && <FormError>{error}</FormError>}
        <Button submit>{anc.id ? "Edit" : "Add"} Category</Button>
    </Form>;

    if (modal)
        return <Modal onHide={hide} title={"Add new challenge"}>
            {body}
        </Modal>;
    return body;
};


export default () => {
    const [challenge, setChallenge] = useState(null);
    const [edit, setEdit] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [lState, setLState] = useState({});
    const [anc, setAnc] = useState(false);

    const { match } = useReactRouter();
    const tabId = match.params.tabId;

    const app = useContext(appContext);
    const api = useContext(apiContext);

    const showChallenge = (challenge) => {
        return () => {
            setChallenge(challenge);
            setIsEditor(false);
        }
    };

    const showEditor = (challenge, saveTo, isNew) => {
        return () => {
            setChallenge(challenge || {});
            setLState({
                saveTo: saveTo
            });
            setIsEditor(true);
            setIsCreator(!!isNew);
        }
    };

    const hideChal = () => {
        setChallenge(null);
        setIsEditor(false);
    };

    const saveEdit = (original) => {
        return changes => {
            let flag;
            try {
                flag = JSON.parse(changes.flag);
            } catch (e) {
                if (!changes.flag.length) flag = "";
                else return app.alert("Invalid flag JSON")
            }

            (isCreator ? api.createChallenge : api.editChallenge)(
                (isCreator ? tabId : original.id),
                changes.name, changes.points, changes.desc, changes.flag_type, flag,
                changes.autoUnlock, original.metadata
            ).then(async () => {
                for (let i in changes)
                    original[i] = changes[i];
                if (lState.saveTo)
                    lState.saveTo.push(original);

                await api.setup();
                setIsEditor(false);
                setChallenge(null);
            }).catch(e => app.alert(api.getError(e)));
        }
    };

    if (!api.challenges)
        api.challenges = [];

    let tab = (() => {
        for (let i = 0; i < api.challenges.length; i++)
            if (api.challenges[i].id === tabId) return api.challenges[i];
    })();
    let chalEl, handler, challengeTab;
    if (tab) {
        handler = plugins.categoryType[tab.type];
        if (!handler) {
            challengeTab = <>
                Category renderer for type "{tab.type}" missing!<br /><br />
                Did you forget to install a plugin?
            </>
        } else {
            challengeTab = React.createElement(handler.component, { challenges: tab, showChallenge: showChallenge, showEditor: showEditor, isEdit: edit });
        }

        if (challenge || isEditor) {
            if (challenge.type)
                handler = plugins.challengeType[challenge.type];
            else
                handler = plugins.challengeType["__default"];

            if (!handler)
                chalEl = <>
                    Challenge renderer for type "{challenge.type}" missing!<br /><br />
                    Did you forget to install a plugin?
                </>;
            else {
                chalEl = React.createElement(
                    handler.component, {
                    challenge: challenge, doHide: hideChal,
                    isEditor: isEditor, saveEdit: saveEdit,
                    isCreator: isCreator,
                })
            }

            chalEl = <Modal onHide={hideChal}>
                {chalEl}
            </Modal>;
        }
    } else {
        if (!api.challenges || !api.challenges.length) return <></>;
        return <Redirect to={"/campaign/" + api.challenges[0].id} />
    }

    // TODO: This
    /*
    let foot;
    if (api.user.is_admin) {
        foot = <SBTSection key={"anc"} title={"Add new category"} noHead>
            <Section light title={"Add new category"}>
                <ANC anc={true} />
            </Section>
        </SBTSection>;
    }*/

    return <Page title={"Challenges"} selfContained>
        {chalEl}
        {anc && <ANC modal anc={anc} hide={() => setAnc(false)} />}

        <SBTSection key={tab.id} subTitle={tab.desc} title={tab.name}>
            {api.user.is_admin ? edit ?
                <Button className={"campEditButton"} click={() => { setEdit(false) }} warning>Stop Editing</Button>
                : <Button className={"campEditButton"} click={() => { setEdit(true) }} warning>Edit</Button> : null}
            {edit && <Button className={"campUnderEditButton"} click={() => setAnc(tab)}>Edit Details</Button>}

            <div className={"campInner"}>{challengeTab}</div>
        </SBTSection>
    </Page>;
};
