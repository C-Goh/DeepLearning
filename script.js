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

    canvas = createCanvas(400, 400);
    canvas.parent("upload");

    background(220);
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

    // Eindeutige ID für das Diagramm
    let chartId = "chart-" + index;

    // HTML + Chart-Container
    container.innerHTML = `
        <div id="${chartId}" style="width:100%;height:300px;"></div>
    `;

    // Daten vorbereiten
    let labels = topResults.map(r => r.label);
    let values = topResults.map(r => r.confidence * 100);

    // Plotly Daten
    let data = [{
        x: labels,
        y: values,
        type: "bar",
        text: values.map(v => v.toFixed(2) + "%"),
        textposition: "auto"
    }];

    let layout = {
        title: "Top 3 Klassifikationen",
        yaxis: {
            title: "Confidence (%)",
            range: [0, 100]
        }
    };

    // Diagramm zeichnen
    Plotly.newPlot(chartId, data, layout);

}

/**
 * Nimmt das hochgeladene Bild, zeigt es auf dem Canvas an und aktiviert den Klassifizierungsbutton.
 * @param {*} event 
 * @returns 
 */
function handleImageUpload(event) {
    document.getElementById("classifyButton").disabled = false;
    const file = event.target.files[0];

    if (!file) return;

    // Canvas nur einmal erstellen
    if (!canvas) {
        canvas = createCanvas(400, 400);
        canvas.parent("upload");
    }

    img = loadImage(URL.createObjectURL(file), () => {
        console.log("Bild geladen & wird angezeigt");

        let maxSize = 400;

        let scale = min(maxSize / img.width, maxSize / img.height);

        resizeCanvas(img.width * scale, img.height * scale);
        image(img, 0, 0, width, height);
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

    label = "Analysiert";
    confidence = "";

    classifier.classify(img, gotResult);
}

function gotResult(results) {
    console.log(results);

    // Top 5 Ergebnisse nehmen
    let topResults = results.slice();

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

    fill(255);
    stroke(0);
    textSize(18);

    let label = "Label: " + results[0].label;
    let confidence = "Confidence: " + (results[0].confidence * 100).toFixed(2) + "%";

    text(label, 10, 360);
    text(confidence, 10, 380);
}