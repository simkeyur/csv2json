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
        readOnly: true, // Make the JSON preview read-only
    });

    document.getElementById('convert-btn').addEventListener('click', function () {
        const csvData = csvEditor.getValue();
        try {
            const jsonData = csvToJson(csvData);
            jsonPreview.setValue(JSON.stringify(jsonData, null, 2)); // Prettify JSON with 2-space indentation
        } catch (error) {
            jsonPreview.setValue(`Error: ${error.message}`);
        }
    });

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

    document.getElementById('copy-csv-btn').addEventListener('click', function () {
        navigator.clipboard.writeText(csvEditor.getValue());
    });

    document.getElementById('copy-json-btn').addEventListener('click', function () {
        navigator.clipboard.writeText(jsonPreview.getValue());
    });

    document.getElementById('download-json-btn').addEventListener('click', function () {
        const blob = new Blob([jsonPreview.getValue()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    Split(['#csv-editor', '#json-preview'], {
        sizes: [50, 50],
        minSize: 200,
    });
});

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