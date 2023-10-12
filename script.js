// script.js

function handleFile() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    const dataType = 'regular';  // Or 'time_series'
    const columnName = 'your_column_name';  // Specify the column to be used

    formData.append('dataType', dataType);
    formData.append('columnName', columnName);

    fetch('http://your-backend-url/api/cluster', {
        method: 'POST',
        body: JSON.stringify({ data: formData }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        // Process the results (e.g., update UI with clustering information)
        console.log('Clustering Result:', data.result);
    });
}
