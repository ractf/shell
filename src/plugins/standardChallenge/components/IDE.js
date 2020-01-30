import React, { useState, useEffect, useCallback, useContext, cloneElement, useRef } from "react";
import PanelGroup from "react-panelgroup";
import { FaFileAlt, FaPython, FaMarkdown, FaTerminal } from "react-icons/fa";

import { CodeInput, TabbedView, appContext } from "ractf";

import "./IDE.scss";

const getInfoFromName = (name, readOnly) => {
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
        case "console":
            if (readOnly) {    
                icon = <FaTerminal />;
                mode = "";
                break;
            }
            // falls through
        default:
            icon = <FaFileAlt />;
            mode = "";
            break;
    }
    return [icon, mode];
}

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
}

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

const FileLabel = ({ name, readOnly, saveNameChange }) => {
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

    let icon = getInfoFromName(edName || name, readOnly)[0];

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

}

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

const Editor = ({ names, splitSide, contents, setContents, setNames }) => {
    let tabs = [[], []];

    names.forEach((_, n) => {
        let setContent = (value) => {
            setContents(contents.map((i, m) => m === n ? value : i));
        }
        let setName = (value) => {
            setNames(names.map((i, m) => m === n ? value : i));
        }

        let mode = getInfoFromName(names[n])[1];

        tabs[splitSide[n]].push(<div key={n} label={<FileLabel saveNameChange={setName} name={names[n]} />}>
            <CodeInput readOnly={splitSide[n] === 1} mode={mode} height={"calc(100vh - 132px)"} val={contents[n]} onChange={setContent} />
        </div>);
    });

    return (
        <PanelGroup>
            <div>
                <TabbedView children={tabs[0]} />
            </div>
            <div>
                <TabbedView children={tabs[1]} />
            </div>
        </PanelGroup>
    );
}

const Window = () => {
    const output = `Compiled with warnings.

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
    
    const [names, setNames] = useState(["BRIEFING.md", "example.py", "Console"]);
    const [contents, setContents] = useState(["", "", output]);
    const [splitSide, setSplitSide] = useState([0, 0, 1]);

    const newFile = useCallback(() => {
        setSplitSide(splitSide.concat(0));
        setContents(contents.concat(""));
        setNames(names.concat("untitled.txt"));
    }, [splitSide, contents, names]);

    const showAbout = () => {
        app.alert(`RACTF Web Editor

Version 0.1a
See https://gitlab.com/ractf/shell for
more information and source code.`);
    }

    return <div className="ideMain">
        <NavBar newFile={newFile} showAbout={showAbout} />
        <Editor names={names} contents={contents} splitSide={splitSide}
                setNames={setNames} setContents={setContents} />
    </div>;
}

export default ({ challenge }) => {
    return <Window />
}
