// script.js

function handleFile() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function(event) {
        const csvData = event.target.result;

        Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                // Process the parsed JSON data
                console.log('Parsed JSON Data:', results.data);
                const jsonData = results.data;

                // Display the data
                displayDataAsTable(jsonData);

                const formData = new FormData();
                formData.append('file', JSON.stringify(jsonData));

                const dataType = 'regular';  // in progress
                const columnName = 'churn';  // in progress

                formData.append('dataType', dataType);
                formData.append('columnName', columnName);

                const backendUrl = 'https://pipstur.pythonanywhere.com/cluster';

                fetch(backendUrl, {
                    method: 'POST',
                    body: formData, 
                })
                .then(response => response.json())
                .then(data => {
                    const resultContainer = document.getElementById('clusteringResult');
                    //resultContainer.innerText = 'Clustering Result: ' + JSON.stringify(data.result); this does nothing
                })
                .catch(error => console.error('Error:', error));
            }
        });
    };

    reader.readAsText(file);
}

function displayDataAsTable(data) {
    const dataTable = document.getElementById('dataTable');

    // Clear existing
    dataTable.innerHTML = '';

    const headersRow = document.createElement('tr');
    for (const header in data[0]) {
        const th = document.createElement('th');
        th.textContent = header;
        headersRow.appendChild(th);
    }
    dataTable.appendChild(headersRow);

    // 25 rows max displayed
    const numRowsToDisplay = Math.min(25, data.length);
    for (let i = 0; i < numRowsToDisplay; i++) {
        const row = data[i];
        const dataRow = document.createElement('tr');
        for (const header in row) {
            const td = document.createElement('td');
            td.textContent = row[header];
            dataRow.appendChild(td);
        }
        dataTable.appendChild(dataRow);
    }
}
