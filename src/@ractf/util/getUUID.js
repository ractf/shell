const getUUID = () => {
    if (window.crypto)
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & ((15 >> c) / 4))).toString(16)
        );
    else
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            return (c === "x" ? r : ((r & 0x3) | 0x8)).toString(16);
        });
};
export default getUUID;
