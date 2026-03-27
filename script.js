let classifier;
let img;

/**
 * Initialisiert die Anwendung, lädt das MobileNet-Modell und klassifiziert die Beispielbilder.
 */
function setup() {
    classifier = ml5.imageClassifier("MobileNet", () => {
        console.log("Model geladen");
        classifyExampleImages();
    });

    document.getElementById("imageUpload")
        .addEventListener("change", handleImageUpload)

    canvas = createCanvas(400, 400);
    canvas.parent("upload");

    background(220);
}

/**
 * Klassifiziert die Beispielbilder und ruft die Funktion showExampleResult auf.
 */
function classifyExampleImages() {
    const images = document.querySelectorAll(".example-row img");

    images.forEach((imgElement, index) => {
        classifier.classify(imgElement, (results) => {
            showExampleResult(results, index);
        });
    });
}


/**
 * Zeigt die Ergebnisse der Bildklassifikation in einem Balkendiagramm an.
 * @param {*} results Ergenisse der Klassifikation
 * @param {*} index Index des Beispielbildes
 */
function showExampleResult(results, index) {
    let container = document.getElementById("result-" + index);

    let topResults = results.slice(0, 3);

    let chartId = "chart-" + index;

    container.innerHTML = `
        <div id="${chartId}" style="width:100%;height:300px;"></div>
    `;

    let labels = topResults.map(r => r.label);
    let values = topResults.map(r => r.confidence * 100);

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

    Plotly.newPlot(chartId, data, layout);

}

/**
 * Nimmt das hochgeladene Bild, zeigt es auf dem Canvas an und aktiviert den Klassifizierungsbutton.
 * @param {*} event Event-Objekt des Datei-Uploads
 * @returns 
 */
function handleImageUpload(event) {
    document.getElementById("classifyButton").disabled = false;
    const file = event.target.files[0];

    if (!file) return;

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

}

/** Zeichnet das Bild und die Klassifikationsergebnisse auf dem Canvas.
 */
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

/**
 * Klassifiziert das aktuell angezeigte Bild und zeigt die Ergebnisse in einem Balkendiagramm an.
 */
function classifyImage() {

    classifier.classify(img, gotResult);
}

/**
 * Verarbeitet die Ergebnisse der Bildklassifikation.
 * @param {*} results Die Klassifikationsergebnisse
 */
function gotResult(results) {
    console.log(results);

    let topResults = results.slice();

    let labels = topResults.map(r => r.label);
    let values = topResults.map(r => (r.confidence * 100).toFixed(2));

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