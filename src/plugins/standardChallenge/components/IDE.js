import React, { useState, useEffect, useCallback, useContext, cloneElement, useRef } from "react";
import PanelGroup from "react-panelgroup";
import Moment from "react-moment";
import { FaFileAlt, FaPython, FaMarkdown, FaTerminal, FaAlignLeft } from "react-icons/fa";
import { MdPlayArrow, MdStop } from "react-icons/md";

import { TabbedView, Tab, appContext, apiContext } from "ractf";
import CodeInput from "./CodeInput";

import "./IDE.scss";

const getInfoFromName = (name) => {
    let ext = name.split(".");
    ext = ext[ext.length - 1];

    let icon, mode;
    switch (ext.toLowerCase()) {
        case "py":
            icon = <FaPython />;
            mode = "python";
            break;
        case "md":
            icon = <FaMarkdown />;
            mode = "markdown";
            break;
        default:
            icon = <FaFileAlt />;
            mode = "";
            break;
    }
    return [icon, mode];
};

const TopBar = ({ children }) => {
    const [open, setOpen] = useState(null);
    const ref = useRef();

    useEffect(() => {
        const handle = (e) => {
            if (!ref.current || !ref.current.contains(e.target))
                setOpen(null);
            if (e.target.className === "ideMenuItem")
                setOpen(null);
        };
        document.addEventListener("click", handle);
        return () => {
            document.removeEventListener("click", handle);
        };
    }, []);

    return <div ref={ref} className="ideTopbar">
        {children.map((i, n) => (
            cloneElement(i, {
                key: n, open: n === open,
                doOpen: () => {setOpen(n)}
            })
        ))}
    </div>;
};

const Menu = ({ title, children, doOpen, open }) => (
    <div className="ideMenu" onClick={doOpen}>
        <div className="ideMenuTitle">{ title }</div>
        {open && <div className="ideMenuBody">
            { children }
        </div>}
    </div>
);

const Item = ({ children, click }) => (
    <div onClick={click} className="ideMenuItem">{ children }</div>
);

const Spacer = () => (
    <div className="ideMenuSpacer" />
);

const FileLabel = ({ name, saveNameChange }) => {
    const [edName, setEdName] = useState(null);
    const ref = useRef();

    useEffect(() => {
        const handle = (e) => {
            if (edName !== null) {
                if (!ref.current || !ref.current.parentNode.contains(e.target)) {
                    saveNameChange(edName);
                    setEdName(null);
                }
            }
        };
        document.addEventListener("click", handle);
        return () => {
            document.removeEventListener("click", handle);
        };
    }, [edName, saveNameChange]);

    let icon = getInfoFromName(edName || name)[0];

    const okd = (e) => {
        if (e.keyCode === 13) {
            saveNameChange(edName);
            setEdName(null);
            e.preventDefault();
            e.stopPropagation();
        } else if (e.keyCode === 27) {
            setEdName(null);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    let nameEl;
    if (edName !== null) {
        nameEl = <input autoFocus ref={ref} className={"tabNameEdit"} value={edName} onKeyDown={okd} onChange={({ target }) => setEdName(target.value)} />;
    } else {
        nameEl = <div onDoubleClick={(e) => { setEdName(name); e.target.focus() }}>{name}</div>
    }

    return <>{icon} {nameEl}</>;
};

const NavBar = ({ newFile, showAbout }) => (
    <TopBar>
        <Menu title={"File"}>
            <Item click={newFile}>New File</Item>
            <Item>Save Project</Item>
            <Spacer />
            <Item>Open File</Item>
            <Spacer />
            <Item>Return to Challenge</Item>
        </Menu>
        <Menu title={"Edit"} />
        <Menu title={"Help"}>
            <Item click={showAbout}>About</Item>
        </Menu>
    </TopBar>
);

const ToolBar = ({ runState, run, stop }) => {
    return <div className={"ideToolbar"}>
        <div className={"ideTButton itbRun" + (runState.running ? " disabled" : "")}
             onClick={runState.running ? (() => 1) : run}
        ><MdPlayArrow /> <span>Run code</span></div>
        <div className={"ideTButton itbStop" + (!runState.running ? " disabled" : "")}
             onClick={runState.running ? stop : (() => 1)}
        ><MdStop /> <span>Stop code</span></div>

        <div className={"ideTLabel"}>{
            runState.running ? <>Running {runState.name}. Elapsed: <Moment interval={1000} durationFromNow>{ runState.start}</Moment></>
            : runState.error ? "Error running code: " + runState.error
                             : "Not running"
        }</div>
    </div>;
};

const File = ({ mode, content, setContent }) => {
    const [liveContent, setLiveContent] = useState(content);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (liveContent !== content)
                setContent(liveContent);
        }, 1000);
        return () => {
            clearTimeout(handler);
        };
    }, [liveContent, content, setContent]);

    return <>
        <CodeInput mode={mode} val={liveContent} height={"calc(100vh - 165px)"}
                   onChange={val => setLiveContent(val)} />
    </>;
};

const Editor = ({ names, contents, changeFile, setNames, output, brief, tab, setTab }) => {
    let tabs = [];

    names.forEach((_, n) => {
        let setName = (value) => {
            setNames(names.map((i, m) => m === n ? value : i));
        }

        let mode = getInfoFromName(names[n])[1];

        tabs.push(<Tab key={n} label={<FileLabel saveNameChange={setName} name={names[n]} />}>
            <File mode={mode} content={contents[n]} setContent={val => changeFile(n, val)} />
        </Tab>);
    });

    return (
        <PanelGroup>
            <div>
                <TabbedView initial={tab} callback={setTab} children={tabs} />
            </div>
            <div>
                <TabbedView>
                    <Tab label={<><FaAlignLeft /> Briefing</>}>
                        <div className={"ideBrief"}>
                            {brief}
                        </div>
                    </Tab>
                    <Tab label={<><FaTerminal /> Console</>}>
                        <CodeInput readOnly height={"calc(100vh - 132px)"} val={output} />
                    </Tab>
                </TabbedView>
            </div>
        </PanelGroup>
    );
};

const Window = ({ brief }) => {
    const output_ = `Compiled with warnings.

    ./src/plugins/standardChallenge/components/Challenge.js
        Line 4:77:   'FormError' is defined but never used            no-unused-vars
        Line 21:12:  'flagValid' is assigned a value but never used   no-unused-vars
        Line 22:12:  'message' is assigned a value but never used     no-unused-vars
        Line 23:12:  'locked' is assigned a value but never used      no-unused-vars
        Line 27:11:  'partial' is assigned a value but never used     no-unused-vars
        Line 31:11:  'changeFlag' is assigned a value but never used  no-unused-vars
        Line 57:11:  'tryFlag' is assigned a value but never used     no-unused-vars
    
    Search for the keywords to learn more about each warning.
    To ignore, add // eslint-disable-next-line to the line before.`;

    const app = useContext(appContext);
    
    const [names, setNames] = useState(["Console"]);
    const [contents, setContents] = useState([""]);
    const [output, setOutput] = useState(output_);
    const [tab, setTab] = useState(0);

    const api = useContext(apiContext);

    useEffect(() => {
        let data = localStorage.getItem("editorFiles");
        try {
            data = JSON.parse(data);
        } catch (e) {
            data = null;
        }
        if (data) {
            setNames(data["names"]);
            setContents(data["content"]);
        }
    }, []);

    const changeFile = (index, content) => {
        setContents(contents.map((i, m) => m === index ? content : i));

        localStorage.setItem("editorFiles", JSON.stringify({
            names: names, content: contents
        }));
    };

    const newFile = useCallback(() => {
        setContents(contents.concat(""));
        setNames(names.concat("untitled.txt"));
    }, [contents, names]);

    const showAbout = () => {
        app.alert(`RACTF Web Editor

Version 0.1a
See https://gitlab.com/ractf/shell for
more information and source code.`);
    }

    const run = () => {
        api.runCode("python", names[tab], contents[tab]);
    }
    const stop = () => {
        api.abortRunCode();
    }

    return <div className="ideMain">
        <NavBar newFile={newFile} showAbout={showAbout} />
        <ToolBar runState={api.codeRunState} run={run} stop={stop} />
        <Editor names={names} contents={contents}
                setNames={setNames} changeFile={changeFile}
                tab={tab} setTab={i => setTab(i)}
                output={output} brief={brief} />
    </div>;
};

export default ({ challenge, children }) => {
    return <Window brief={children} />
};
