// script.js
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function calculateRaw() {
    let dataInput = document.getElementById('data-input').value;
    let data = dataInput.split(',').map(num => parseFloat(num.trim()));

    if (data.some(isNaN)) {
        alert("Please enter valid numbers.");
        return;
    }

    let mean = calculateMean(data);
    let variance = calculateVariance(data, mean);
    let stdDev = Math.sqrt(variance);
    let cv = (stdDev / mean) * 100;

    displaySteps(data, mean, variance, stdDev, cv, 'raw');
    displayResults(stdDev, cv);
    document.getElementById('freq-table').innerHTML = ""; // Clear frequency table
}

function calculateFrequency() {
    let valuesInput = document.getElementById('values-input').value;
    let frequenciesInput = document.getElementById('frequencies-input').value;

    let values = valuesInput.split(',').map(num => parseFloat(num.trim()));
    let frequencies = frequenciesInput.split(',').map(num => parseFloat(num.trim()));

    if (values.length !== frequencies.length || values.some(isNaN) || frequencies.some(isNaN)) {
        alert("Please enter valid numbers and ensure the same number of values and frequencies.");
        return;
    }

    let mean = calculateMeanFrequency(values, frequencies);
    let variance = calculateVarianceFrequency(values, frequencies, mean);
    let stdDev = Math.sqrt(variance);
    let cv = (stdDev / mean) * 100;

    displaySteps(values, mean, variance, stdDev, cv, 'frequency');
    displayResults(stdDev, cv);
    displayFrequencyTable(values, frequencies); // Display frequency table
}

function calculateMean(data) {
    let sum = data.reduce((a, b) => a + b, 0);
    return sum / data.length;
}

function calculateMeanFrequency(values, frequencies) {
    let totalFrequency = frequencies.reduce((a, b) => a + b, 0);
    let weightedSum = values.reduce((sum, value, i) => sum + value * frequencies[i], 0);
    return weightedSum / totalFrequency;
}

function calculateVariance(data, mean) {
    let sumSquaredDifferences = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    return sumSquaredDifferences / data.length;
}

function calculateVarianceFrequency(values, frequencies, mean) {
    let weightedSquaredDifferences = values.reduce((sum, value, i) => sum + frequencies[i] * Math.pow(value - mean, 2), 0);
    let totalFrequency = frequencies.reduce((a, b) => a + b, 0);
    return weightedSquaredDifferences / totalFrequency;
}

function displaySteps(data, mean, variance, stdDev, cv, type) {
    let steps = `
        <h3>Steps to Calculate Standard Deviation & Coefficient of Variation (${type === 'raw' ? 'Raw Data' : 'Frequency Distribution'})</h3>
        <ol>
            <li><strong>Step 1:</strong> Enter the data: ${data.join(', ')}</li>
            <li><strong>Step 2:</strong> Calculate the mean (average): <strong>${mean}</strong></li>
            <li><strong>Step 3:</strong> Calculate each data point's squared difference from the mean: 
                <ul>
                    ${data.map(value => `<li>(${value} - ${mean})²</li>`).join('')}
                </ul>
            </li>
            <li><strong>Step 4:</strong> Calculate the variance: <strong>${variance}</strong></li>
            <li><strong>Step 5:</strong> Standard deviation (√variance): <strong>${stdDev}</strong></li>
            <li><strong>Step 6:</strong> Coefficient of variation (Standard deviation / Mean * 100): <strong>${cv.toFixed(2)}%</strong></li>
        </ol>
    `;
    document.getElementById('steps').innerHTML = steps;
}

function displayResults(stdDev, cv) {
    document.getElementById('std-dev').innerText = `Standard Deviation: ${stdDev.toFixed(2)}`;
    document.getElementById('cv').innerText = `Coefficient of Variation: ${cv.toFixed(2)}%`;
}

function displayFrequencyTable(values, frequencies) {
    let tableHTML = `<table id="freq-table">
        <thead>
            <tr><th>Data Value</th><th>Frequency</th><th>Value * Frequency</th></tr>
        </thead>
        <tbody>
            ${values.map((value, index) => {
                let freqValue = frequencies[index];
                return `<tr><td>${value}</td><td>${freqValue}</td><td>${(value * freqValue).toFixed(2)}</td></tr>`;
            }).join('')}
        </tbody>
    </table>`;
    
    document.getElementById('freq-table').innerHTML = tableHTML;
}

function restart() {
    document.getElementById('data-input').value = '';
    document.getElementById('values-input').value = '';
    document.getElementById('frequencies-input').value = '';
    document.getElementById('steps').innerHTML = '';
    document.getElementById('std-dev').innerText = '';
    document.getElementById('cv').innerText = '';
    document.getElementById('freq-table').innerHTML = '';
}