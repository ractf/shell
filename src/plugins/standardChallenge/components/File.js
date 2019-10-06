import React from "react";
import { FaFile } from "react-icons/fa";

import ChallengeLink, { LinkMeta } from "./ChallengeLinks";


export default ({ name, url, size }) => {
    const formatBytes = bytes => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return <ChallengeLink>
        <FaFile />
        <div>
            <a href={url} target={"_blank"}>{name}</a>
            <LinkMeta>{formatBytes(size)}</LinkMeta>
        </div>
    </ChallengeLink>;
}
