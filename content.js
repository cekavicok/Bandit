function extractEmailContainer() {
    // Gmail telo maila
    return document.querySelector('.ii.gt > div.a3s'); 
}
//skibidi


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
    "hitno": { points: 8, description: "Izaziva osećaj hitnosti." },
    "skibidi": { points: 5, description: "SKIBIDI SOLJA" },
    "odmah|одмах": { points: 8, description: "Stvara pritisak za brzu reakciju." },
    "poslednje upozorenje|последње упозорење": { points: 12, description: "Tipična phishing taktika pritiska." },
    "u roku od 24 sata": { points: 10, description: "Veštački vremenski pritisak." },
    "vaš nalog će biti ugašen|ваш налог ће бити угашен": { points: 15, description: "Pretnja gašenjem naloga." },

    "blokiran|закључан налог": { points: 12, description: "Lažna blokada naloga." },
    "suspendovan": { points: 12, description: "Navodna suspenzija naloga." },
    "ograničen pristup": { points: 10, description: "Manipulacija pristupom nalogu." },

    "verifikuj": { points: 12, description: "Zahtev za verifikaciju podataka." },
    "potvrdite identitet": { points: 15, description: "Pokušaj krađe identiteta." },
    "unesite lozinku|унесите лозинку": { points: 20, description: "Traženje lozinke je ozbiljan rizik." },
    "ažurirajte podatke|ажурирајте податке": { points: 12, description: "Česta phishing formulacija." },
    "resetujte lozinku|ресетујте лозинку": { points: 15, description: "Može biti pokušaj krađe naloga." },

    "nagrada": { points: 10, description: "Lažno obećanje nagrade." },
    "dobitnik": { points: 12, description: "Manipulacija dobitkom." },
    "uplata": { points: 8, description: "Finansijska manipulacija." },
    "račun je terećen|рачун је терећен": { points: 15, description: "Lažna finansijska transakcija." },
    "neovlašćena transakcija|неовлашћена трансакција": { points: 18, description: "Izaziva paniku oko novca." },

    "poverljivo": { points: 8, description: "Stvara osećaj tajnosti." },
    "kliknite ovde|кликните овде": { points: 10, description: "Direktan poziv na akciju." },
    "preuzmite dokument|преузмите документ": { points: 12, description: "Može voditi ka malware-u." },
    "sigurnosna provera|сигурносна провера": { points: 10, description: "Lažno predstavljanje bezbednosti." },
    "osigurajte nalog|осигурајте налог": { points: 12, description: "Poziv na akciju, može biti phishing." },
    "otvorite odmah|отворите одмах": { points: 10, description: "Pritisak da se odmah otvori link ili attachment." },
    "odmah preuzmite|одмах преузмите": { points: 10, description: "Pritisak da korisnik odmah preuzme fajl." }
};

function analyzeSender() {

    let senderScore = 0;
    let reasons = [];

    const senderElement = document.querySelector('span[email]');
    if (!senderElement) return { senderScore, reasons };

    const senderEmail = senderElement.getAttribute("email").toLowerCase();

    // 🔴 1. Noreply sa čudnim domenom
    if (senderEmail.startsWith("noreply") || senderEmail.startsWith("no-reply")) {
        if (!senderEmail.includes(".com") && !senderEmail.includes(".rs")) {
            senderScore += 10;
            reasons.push("Noreply adresa sa neobičnim domenom.");
        }
    }

    // 🔴 2. Sumnjivi TLD
    const suspiciousTLDs = [".cc", ".ru", ".xyz", ".top", ".click", ".tk"];
    suspiciousTLDs.forEach(tld => {
        if (senderEmail.includes(tld)) {
            senderScore += 15;
            reasons.push(`Pošiljalac koristi sumnjiv TLD (${tld}).`);
        }
    });

    // 🔴 3. Banka + secure + random domen
    if (senderEmail.includes("banka") && senderEmail.includes("secure")) {
        if (!senderEmail.includes(".com") && !senderEmail.includes(".rs")) {
            senderScore += 20;
            reasons.push("Lažno predstavljanje banke sa nelegitimnim domenom.");
        }
    }

    // 🔴 4. Previše brojeva u adresi
    const numbers = senderEmail.match(/\d/g);
    if (numbers && numbers.length >= 5) {
        senderScore += 10;
        reasons.push("Email sadrži veliki broj nasumičnih brojeva.");
    }

    // 🔴 5. Dugačak domen (random string)
    const domain = senderEmail.split("@")[1];
    if (domain && domain.length > 25) {
        senderScore += 10;
        reasons.push("Neobično dugačak domen može biti generisan automatski.");
    }

    if (senderScore > 25) senderScore = 25;

    return { senderScore, reasons };
}


const homoglyphMap = {
    "i": ["l", "1", "ı"],
    "l": ["1", "i", "ı"],
    "o": ["0", "Ο"],  // latinski O i nula
    "a": ["@","α"]
};

const diacriticsMap = {
    "č": "[čc]",
    "ć": "[ćc]",
    "š": "[šs]",
    "đ": "[đd]",
    "ž": "[žz]",
    "Č": "[ČC]",
    "Ć": "[ĆC]",
    "Š": "[ŠS]",
    "Đ": "[ĐD]",
    "Ž": "[ŽZ]"
};

function buildDiacriticRegex(word) {
    // zamenjuje svaki karakter koji ima dijakritik sa [xX] verzijom
    return word.split("").map(c => diacriticsMap[c] || c).join("");
}

function checkHomoglyphs(text, keywords) {
    let score = 0;
    let reasons = [];

    keywords.forEach(word => {
        const regex = new RegExp(word.split("").map(c => {
            const chars = [c, ...(homoglyphMap[c]||[])].join("");
            return `[${chars}]`;
        }).join(""), "gi");

        if (text.match(regex)) {
            score += 15;
            reasons.push(`Mogući homoglyph napad detektovan: "${word}" u tekstu.`);
        }
    });

    return { score, reasons };
}
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
        const occurrences = (lowerText.match(new RegExp(word, "gi")) || []).length;

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

    const senderResult = analyzeSender();
    totalScore += senderResult.senderScore;
    reasons = reasons.concat(senderResult.reasons);

    const hgResult = checkHomoglyphs(lowerText, ["paypal","bank","banka","mastercard"]);
    totalScore += hgResult.score;
    reasons = reasons.concat(hgResult.reasons);

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
    panel.style.padding = "30px";
    panel.style.maxWidth = "500px";
    panel.style.fontFamily = "'DM Sans', Arial, sans-serif";
    panel.style.borderRadius = "5px"; // Adding a slight radius for a modern look
   

    let riskColor = "#9AFF8D";
    if (result.score >= 70) riskColor = "#DE6464";
    else if (result.score >= 40) riskColor = "#FFD752";

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
    button.innerHTML = `
    <span>Analiziraj</span>
    <svg width="17" height="auto" viewBox="0 0 42 37" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 12px;">
        <path d="M37.2092 27.7462L26.4092 21.5791L30.5786 37H21.0031V24.6687L9.57856 35.953L4.79387 27.7553L15.6 21.5881L0 17.4545L4.7908 9.25683L15.5939 15.424L11.4214 0H20.9969V12.3313L32.4153 1.05004L37.2061 9.24775L26.4061 15.4149L42 19.5485L37.2092 27.7462Z" fill="black"/>
    </svg>
    `;

    // Positioning
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "9999";

    // Styling to match the image
    button.style.backgroundColor = "#ff6b6b"; // The specific coral/red shade
    button.style.color = "black";              // Bold black text as seen in image
    button.style.fontSize = "16px";            // Adjust based on your preference
    button.style.fontWeight = "bold";
    button.style.fontFamily = "sans-serif";
    button.style.padding = "12px 16px";
    button.style.borderRadius = "5px";        // Smooth rounded corners
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"; // Optional: adds a bit of depth

    // Hover effect
    button.onmouseover = () => button.style.backgroundColor = "#ff5252";
    button.onmouseout = () => button.style.backgroundColor = "#ff6b6b";

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