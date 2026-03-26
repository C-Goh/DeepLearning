let classifier;

function setup() {
    classifier = ml5.imageClassifier('MobileNet', modelLoaded);
}

function modelLoaded() {
    console.log("Model geladen!");
}

const imageElement = document.getElementById("image");

document.getElementById("imageUpload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    imageElement.src = URL.createObjectURL(file);
});

function classifyImage() {
    classifier.classify(imageElement, gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }

    console.log(results);

    document.getElementById("result").innerText =
        results[0].label + " (" + (results[0].confidence * 100).toFixed(2) + "%)";
    showChart(results)
}

let chart;

function showChart(results) {
    const labels = results.map(r => r.label);
    const data = results.map(r => r.confidence);

    const ctx = document.getElementById('chart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Confidence',
                data: data
            }]
        }
    });
}

function classifyExample(img, expectedLabel) {
  classifier.classify(img, function(error, results) {
    if (error) {
      console.error(error);
      return;
    }

    const predicted = results[0].label;

    const isCorrect = predicted.includes(expectedLabel);

    img.style.border = isCorrect ? "5px solid green" : "5px solid red";

    showChart(results);
  });
}