import React, { useState, useContext } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";

import { SectionBlurb, SectionTitle2 } from "../../components/Misc";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import { plugins, Button, apiContext, Input, Form, FormError, appContext } from "ractf";

import "./Campaign.scss";


const ANC = ({ hide, anc }) => {
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
            hide();
        }).catch(e => {
            setError(api.getError(e));
            setLocked(false);
        });
    }

    return <Modal onHide={hide} title={"Hi"}>
        <Form locked={locked} handle={create}>
            <SectionTitle2>{anc.id ? "Edit" : "Add new"} category</SectionTitle2>
            <label htmlFor={"cname"}>Catgeory name</label>
            <Input val={anc.name} name={"cname"} placeholder={"Catgeory name"} />
            <label htmlFor={"cdesc"}>Catgeory brief</label>
            <Input val={anc.desc} name={"cdesc"} rows={5} placeholder={"Category brief"} />
            <label htmlFor={"ctype"}>Catgeory type</label>
            <Input val={anc.type} name={"ctype"} format={{ test: i => !!plugins.categoryType[i] }} placeholder={"Category type"} />
            {error && <FormError>{error}</FormError>}
            <Button submit>{anc.id ? "Edit" : "Add"} Category</Button>
        </Form>
    </Modal>;
}


export default () => {
    const [challenge, setChallenge] = useState(null);
    const [edit, setEdit] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [lState, setLState] = useState({});
    const [anc, setAnc] = useState(false);

    const [activeTab, setActiveTab] = useState(0);
    const [sbHidden, setSbHidden] = useState(false);
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
            })
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
                (isCreator ? api.challenges[activeTab].id : original.id),
                changes.name, changes.points, changes.desc, changes.flag_type, flag,
                original.metadata
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

    let tab = api.challenges[activeTab];
    let chalEl, handler, challengeTab;
    if (tab) {
        handler = plugins.categoryType[tab.type];
        if (!handler) {
            challengeTab = <>
                Category renderer for type "{tab.type}" missing!<br /><br />
                Did you forget to install a plugin?
            </>
        } else {
            challengeTab = <>
                {edit && <Button click={() => setAnc(tab)}>Edit Details</Button>}
                <SectionBlurb>{tab.desc}</SectionBlurb>
                {React.createElement(handler.component, { challenges: tab, showChallenge: showChallenge, showEditor: showEditor, isEdit: edit })}
            </>
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
    }

    return <Page title={"Challenges"} selfContained>
        {chalEl}
        {anc && <ANC anc={anc} hide={() => setAnc(false)} />}
        <div style={{ display: "flex", flexGrow: "1" }}>
            <div className={"sbWrapWrap"}><div className={"sbWrap"}>
                <div className={"campSidebar" + (sbHidden ? " sbHidden" : "")}>
                    <div className={"head"}>Categories</div>
                    {api.challenges.map((tab, n) =>
                        <div key={n} className={activeTab === n ? "active" : ""}
                            onClick={() => { setActiveTab(n) }}
                        >{tab.name}</div>
                    )}
                    <div className={"sbSpace"} />
                    {api.user.is_admin &&
                        <div onClick={e => setAnc(true)} style={{ textAlign: "center" }}>Add New Category</div>
                    }
                </div>
                <div className={"sbBurger" + (sbHidden ? " sbHidden" : "")} onClick={() => setSbHidden(!sbHidden)}><MdKeyboardArrowLeft /></div>
            </div></div>
            <div className={"challengeBody"}><div>
                {api.user.is_admin ? edit ?
                    <Button className={"campEditButton"} click={() => { setEdit(false) }} warning>Stop Editing</Button>
                    : <Button className={"campEditButton"} click={() => { setEdit(true) }} warning>Edit</Button> : null}

                {challengeTab}
            </div></div>
        </div>
    </Page>;
};
