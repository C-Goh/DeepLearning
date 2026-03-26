let classifier;
let img;

let label = "";
let confidence = "";

function setup() {
 classifier = ml5.imageClassifier("MobileNet", () => {
        console.log("Model geladen");

        // Sobald Modell geladen → Beispielbilder klassifizieren
        classifyExampleImages();
    });

    document.getElementById("imageUpload")
        .addEventListener("change", handleImageUpload)
}

function classifyExampleImages() {
    const images = document.querySelectorAll(".example-row img");

    images.forEach((imgElement, index) => {
        classifier.classify(imgElement, (results) => {
            showExampleResult(results, index);
        });
    });
}

function showExampleResult(results, index) {
    let container = document.getElementById("result-" + index);

    let topResults = results.slice(0, 3);

    container.innerHTML = `<h4>Bild ${index + 1}</h4>`;

    topResults.forEach(r => {
        container.innerHTML += `
            <p>${r.label} (${(r.confidence * 100).toFixed(2)}%)</p>
        `;
    });
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    let canvas = createCanvas(400, 400);
    canvas.parent("upload"); // <-- hier dein div mit id="upload"

    if (!file) return;

    img = loadImage(URL.createObjectURL(file), () => {
        console.log("Bild direkt geladen & angezeigt");
    });

    // optional: Text zurücksetzen
    label = "";
    confidence = "";
}

function draw() {
    background(220);

    if (img) {
        image(img, 0, 0, width, height);
    }

    fill(255);
    stroke(0);
    textSize(18);
    text(label, 10, 360);
    text(confidence, 10, 380);
}

function classifyImage() {
    if (!img) {
        label = "Bitte zuerst ein Bild hochladen!";
        return;
    }

    label = "Analysiere...";
    confidence = "";

    classifier.classify(img, gotResult);
}

function gotResult(results) {
    console.log(results);

    // Top 5 Ergebnisse nehmen
    let topResults = results.slice(0, 5);

    let labels = topResults.map(r => r.label);
    let values = topResults.map(r => (r.confidence * 100).toFixed(2));

    // Plotly Daten
    let data = [{
        x: labels,
        y: values,
        type: "bar",
        text: values.map(v => v + "%"),
        textposition: "auto"
    }];

    let layout = {
        title: "Klassifikation (Confidence in %)",
        yaxis: {
            title: "Confidence (%)",
            range: [0, 100]
        }
    };

    Plotly.newPlot("chart", data, layout);

    // OPTIONAL: Text im Canvas wie vorher
    fill(255);
    stroke(0);
    textSize(18);

    let label = "Label: " + results[0].label;
    let confidence = "Confidence: " + (results[0].confidence * 100).toFixed(2) + "%";

    text(label, 10, 360);
    text(confidence, 10, 380);
}