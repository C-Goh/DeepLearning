let classifier;
let img;

let label = "";
let confidence = "";

function setup() {
    createCanvas(400, 400);

    classifier = ml5.imageClassifier("MobileNet", () => {
        console.log("Model geladen");
    });

    // reagiert sofort auf Upload
    document.getElementById("imageUpload").addEventListener("change", handleImageUpload);
}

function handleImageUpload(event) {
    const file = event.target.files[0];

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
    fill(255); 
    stroke(0); 
    textSize(18); 
    label = "Label: " + results[0].label; 
    confidence = "Confidence: " + nf(results[0].confidence, 0, 2); text(label, 10, 360); text(confidence, 10, 380); 
}