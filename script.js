document.addEventListener('DOMContentLoaded', function () {
    const csvEditor = CodeMirror(document.getElementById('csv-editor'), {
        mode: 'text/plain',
        theme: 'dracula',
        lineNumbers: true,
        matchBrackets: true,
    });

    const jsonPreview = CodeMirror(document.getElementById('json-preview'), {
        mode: 'application/json',
        theme: 'dracula',
        lineNumbers: true,
        // Removed readOnly: true to make it editable
    });

    // Convert CSV to JSON
    document.getElementById('convert-to-json-btn').addEventListener('click', function () {
        const csvData = csvEditor.getValue();
        try {
            const jsonData = csvToJson(csvData);
            jsonPreview.setValue(JSON.stringify(jsonData, null, 2));
        } catch (error) {
            jsonPreview.setValue(`Error: ${error.message}`);
        }
    });

    // Convert JSON to CSV
    document.getElementById('convert-to-csv-btn').addEventListener('click', function () {
        const jsonData = jsonPreview.getValue();
        try {
            const csvData = jsonToCsv(jsonData);
            csvEditor.setValue(csvData);
        } catch (error) {
            csvEditor.setValue(`Error: ${error.message}`);
        }
    });

    // Upload CSV File
    document.getElementById('csv-file-upload').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                csvEditor.setValue(e.target.result);
            };
            reader.readAsText(file);
        }
    });

    // Upload JSON File
    document.getElementById('json-file-upload').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                jsonPreview.setValue(e.target.result);
            };
            reader.readAsText(file);
        }
    });

    // Copy CSV
    document.getElementById('copy-csv-btn').addEventListener('click', function () {
        navigator.clipboard.writeText(csvEditor.getValue());
    });

    // Copy JSON
    document.getElementById('copy-json-btn').addEventListener('click', function () {
        navigator.clipboard.writeText(jsonPreview.getValue());
    });

    // Download JSON
    document.getElementById('download-json-btn').addEventListener('click', function () {
        const blob = new Blob([jsonPreview.getValue()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Download CSV
    document.getElementById('download-csv-btn').addEventListener('click', function () {
        const blob = new Blob([csvEditor.getValue()], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.csv';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Resizable Panels
    Split(['#csv-editor', '#json-preview'], {
        sizes: [50, 50],
        minSize: 200,
    });
});

// Convert CSV to JSON
function csvToJson(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }

    return result;
}

// Convert JSON to CSV
function jsonToCsv(json) {
    try {
        const data = JSON.parse(json);
        if (!Array.isArray(data)) {
            throw new Error('JSON must be an array of objects.');
        }

        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Add headers
        csvRows.push(headers.join(','));

        // Add rows
        data.forEach((row) => {
            const values = headers.map((header) => row[header]);
            csvRows.push(values.join(','));
        });

        return csvRows.join('\n');
    } catch (error) {
        throw new Error('Invalid JSON format: ' + error.message);
    }
}