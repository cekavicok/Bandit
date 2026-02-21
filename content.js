function extractEmailContainer() {
    // Gmail telo maila
    return document.querySelector('.ii.gt > div.a3s'); 
}


function extractEmailText() {
    const main = document.querySelector('div[role="main"]');
    if (!main) return "";
    return main.innerText;
}

/* =====================================================
   🔴 OVDE MENJAŠ I DODAJEŠ RIZIČNE REČI
   Format:
   "reč": {
       points: broj_poena,
       description: "opis zašto je rizična"
   }
===================================================== */

const riskyWords = {
    "hitno": {
        points: 10,
        description: "Koristi se da izazove paniku i ubrza reakciju."
    },
    "odmah": {
        points: 10,
        description: "Stvara pritisak da korisnik reaguje bez razmišljanja."
    },
    "verifikuj": {
        points: 15,
        description: "Često se koristi u phishing napadima za krađu podataka."
    },
    "lozinka": {
        points: 20,
        description: "Traženje lozinke je ozbiljan bezbednosni rizik."
    },
    "blokiran": {
        points: 15,
        description: "Lažna upozorenja o blokadi naloga su česta phishing taktika."
    },
    "skibidi": {
        points: 5,
        description: "MNOGO RIZIČNA REČ, MOŽE IZAZVATI SMRT OD SMEHA"
    }
};

/* ===================================================== */

function analyzeEmail(text) {

    let totalScore = 0;
    let reasons = [];
    const lowerText = text.toLowerCase();

    // =========================
    // 1️⃣ LINGUISTIC RISK (max 30)
    // =========================
    let linguisticScore = 0;

    for (const word in riskyWords) {
        const occurrences = (lowerText.match(new RegExp(word, "g")) || []).length;

        if (occurrences > 0) {
            linguisticScore += riskyWords[word].points * occurrences;
            reasons.push(`"${word}" (${occurrences}x) – ${riskyWords[word].description}`);
        }
    }

    if (linguisticScore > 30) linguisticScore = 30;
    totalScore += linguisticScore;


    // =========================
    // 2️⃣ LINK ANALYSIS (max 35)
    // =========================
    const emailContainer = extractEmailContainer();
    const links = emailContainer ? emailContainer.querySelectorAll("a") : [];

    let linkScore = 0;
    const suspiciousDomains = [".ru", ".xyz", ".top", ".click", ".tk"];
    const shortenedDomains = ["bit.ly", "tinyurl", "t.co"];

    if (links.length > 0) {
        linkScore += 10; 
        reasons.push("Email sadrži link.");
    }

    links.forEach(link => {
        const href = link.href ? link.href.toLowerCase() : "";

        suspiciousDomains.forEach(domain => {
            if (href.includes(domain)) {
                linkScore += 15;
                reasons.push(`Sumnjiv domen (${domain}).`);
            }
        });

        shortenedDomains.forEach(short => {
            if (href.includes(short)) {
                linkScore += 15;
                reasons.push(`Skraćen link (${short}) može sakriti pravi URL.`);
            }
        });
    });

    if (linkScore > 35) linkScore = 35;
    totalScore += linkScore;


    // =========================
    // 3️⃣ ATTACHMENT RISK (max 15)
    // =========================
    const attachments = emailContainer ? emailContainer.querySelectorAll('[download], .aQH, .aV3') : [];
    let attachmentScore = 0;
   

    if (attachments.length > 0) {
        attachmentScore += 10;
        reasons.push("Email sadrži attachment.");
    }

    attachments.forEach(att => {
        const name = att.innerText.toLowerCase();

        if (name.endsWith(".exe") || name.endsWith(".zip") || name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".bat") || name.endsWith(".cmd") || name.endsWith(".rar")) {
            attachmentScore += 5;
            reasons.push("Potencijalno opasan tip fajla (.exe/.zip/.js/.ts/.bat/.cmd/.rar).");
        }
    });

    if (attachmentScore > 15) attachmentScore = 15;
    totalScore += attachmentScore;


    // =========================
    // 4️⃣ STRUCTURAL RISK (max 20)
    // =========================
    let structuralScore = 0;

    // CAPS LOCK manipulacija
    const uppercaseMatches = text.match(/[A-ZŠĐČĆŽ]{6,}/g);
    if (uppercaseMatches) {
        structuralScore += 10;
        reasons.push("Prekomerna upotreba velikih slova (manipulacija pažnjom).");
    }

    // Previše uskličnika
    const exclamations = (text.match(/!/g) || []).length;
    if (exclamations >= 3) {
        structuralScore += 10;
        reasons.push("Prekomerna upotreba uzvičnika.");
    }

    if (structuralScore > 20) structuralScore = 20;
    totalScore += structuralScore;


    if (totalScore > 100) totalScore = 100;

    return { score: totalScore, reasons };
}


function showResult(result) {

    const oldPanel = document.getElementById("phishing-panel");
    if (oldPanel) oldPanel.remove();

    const panel = document.createElement("div");
    panel.id = "phishing-panel";

    panel.style.position = "fixed";
    panel.style.top = "20px";
    panel.style.right = "20px";
    panel.style.zIndex = "9999";
    panel.style.padding = "15px";
    panel.style.backgroundColor = "white";
    panel.style.border = "2px solid black";
    panel.style.maxWidth = "350px";
    panel.style.fontFamily = "Arial";

    let riskColor = "green";
    if (result.score >= 70) riskColor = "red";
    else if (result.score >= 40) riskColor = "orange";

    panel.innerHTML = `
        <h3 style="color:${riskColor}">
            ${result.score}% verovatnoće da je phishing
        </h3>
        <hr>
        <strong>Razlozi:</strong>
        <ul>
            ${result.reasons.map(r => `<li>${r}</li>`).join("")}
        </ul>
        <button id="closePanel">Zatvori</button>
    `;

    document.body.appendChild(panel);

    document.getElementById("closePanel").onclick = () => panel.remove();
}


function isEmailOpen() {
    // Gmail telo maila
    return document.querySelector('.ii.gt') !== null;
}

function addScanButton() {
    const existing = document.getElementById("phishing-btn");

    if (!isEmailOpen()) {
        // Ako nije otvoren mail, ukloni dugme ako postoji
        if (existing) existing.remove();
        return;
    }

    // Ako dugme već postoji, ne dodaj ponovo
    if (existing) return;

    // Kreiraj dugme
    const button = document.createElement("button");
    button.id = "phishing-btn";
    button.innerText = "Proveri phishing";

    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "9999";
    button.style.padding = "10px";
    button.style.backgroundColor = "red";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
        const emailText = extractEmailText();
        const result = analyzeEmail(emailText);
        showResult(result);
    });

    document.body.appendChild(button);
}

// Proverava DOM svake sekunde
setInterval(addScanButton, 100);

addScanButton();