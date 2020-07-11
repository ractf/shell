export const cleanFilename = (name) => {
    name = name.replace(/[ ]/g, "_");
    name = name.replace(/[^0-9a-zA-Z-._]/g, "");
    return name;
};

export const downloadData = (data, filename, mimetype) => {
    const blob = new Blob([data], { type: `${mimetype};charset=utf-8;` });
    if (navigator.msSaveBlob)
        return navigator.msSaveBlob(blob, filename);

    const elem = document.createElement("a");
    elem.style = "display: none";
    elem.href = URL.createObjectURL(blob);
    elem.target = "_blank";
    elem.setAttribute("download", filename);
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
};

export const downloadJSON = (data, filename) => {
    downloadData(JSON.stringify(data, null, 2), filename + ".json", "application/json");
};

export const downloadCSV = (data, filename) => {
    let csv = "";
    data.forEach(rowData => {
        let row = "";
        rowData.forEach(cellData => {
            if (row) row += ",";
            let cell = JSON.stringify(cellData ? cellData.toString() : "");
            if (cell[1] === "=")
                cell = `=${cell}`;
            row += cell;
        });
        csv += row + "\n";
    });
    downloadData(csv, filename + ".csv", "text/csv");
};
