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
                // Process the parsed JSON data (results.data)
                console.log('Parsed JSON Data:', results.data);
                const jsonData = results.data;

                // Display the data as a table
                //displayDataAsTable(jsonData);

                const formData = new FormData();
                formData.append('file', JSON.stringify(jsonData));

                const dataType = 'regular';  // Or 'time_series'
                const columnName = 'churn';  // Specify the column to be used

                formData.append('dataType', dataType);
                formData.append('columnName', columnName);


                const backendUrl = 'https://pipstur.pythonanywhere.com/cluster';
                //const backendUrl = 'http://localhost:5000/cluster'; // Replace with your actual backend URL

                fetch(backendUrl, {
                    method: 'POST',
                    body: formData,  // Use formData directly
                })
                .then(response => response.json())
                .then(data => {
                    const clusteringResults = data.result;
                    console.log('Clustering Results:', clusteringResults); 
                    displayDataAsTable(jsonData, clusteringResults); 
                })
                .catch(error => console.error('Error:', error));
            }
        });
    };

    reader.readAsText(file);
}

function displayDataAsTable(data, clusteringResults) {
    const dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = '';

    const headersRow = document.createElement('tr');
    for (const header in data[0]) {
        const th = document.createElement('th');
        th.textContent = header;
        headersRow.appendChild(th);
    }

    const clusteringHeader = document.createElement('th');
    clusteringHeader.textContent = 'Clustering Result';
    clusteringHeader.classList.add('clustering-column');  // Apply the CSS class
    headersRow.appendChild(clusteringHeader);

    dataTable.appendChild(headersRow);

    const numRowsToDisplay = Math.min(25, data.length);
    for (let i = 0; i < numRowsToDisplay; i++) {
        const row = data[i];
        const dataRow = document.createElement('tr');
        for (const header in row) {
            const td = document.createElement('td');
            td.textContent = row[header];
            dataRow.appendChild(td);
        }

        const clusteringData = document.createElement('td');
        const clusteringValue = clusteringResults[i] === 0 ? 'No' : 'Yes';
        clusteringData.textContent = clusteringValue;
        clusteringData.classList.add('clustering-column');  // Apply the CSS class
        dataRow.appendChild(clusteringData);

        dataTable.appendChild(dataRow);
    }
}




// function fetchAndDisplayGraph() {
//     const graphImage = document.getElementById('graphImage');

//     fetch('http://localhost:5000/generate_graph')
//         .then(response => response.blob())
//         .then(blob => {
//             const url = URL.createObjectURL(blob);
//             graphImage.src = url;
//         })
//         .catch(error => console.error('Error:', error));
// }

// document.addEventListener('DOMContentLoaded', fetchAndDisplayGraph);
