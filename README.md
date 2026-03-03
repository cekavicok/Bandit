# Bandit — Phishing Detection Browser Extension

> *In Catan, when you roll a 7, the Bandit moves — and someone loses their resources. In the digital world, we move the Bandit onto the scammers.*

Bandit is a browser extension that detects phishing emails in real time, educates users about social engineering tactics, and helps organizations measure and improve their cybersecurity posture.

---

## Features

### Real-Time Email Analysis
- One-click email risk analysis directly in your browser
- Checks sender address, subject line, body content, links, attachments, and message structure
- Returns a **risk score (0–100%)** with a clear explanation of why an email was flagged
- If risk exceeds **50%**, the user is prompted to move the message to spam

### Educational Platform
- Every analysis includes a mini-explanation of detected threats
- Access a library of lessons on phishing tactics and regional scam trends
- Take mini-quizzes to sharpen your ability to spot fraud
- Build a **personalized security score** based on your activity and behavior

### Admin Panel (for Organizations)
- Simulate phishing campaigns to test employee awareness
- Track individual and team security scores over time
- View statistics on clicked links and unreported suspicious emails
- Make cybersecurity **measurable and actionable**

---

## Project Structure

```
Bandit/
├── manifest.json     # Extension configuration
├── content.js        # Core analysis logic injected into webpages
├── popup.html        # Extension popup UI
├── styles.css        # Popup styling
└── .gitignore
```

---

## Installation (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/cekavicok/Bandit.git
   ```

2. Open your browser and navigate to the extensions page:
   - **Chrome / Edge:** `chrome://extensions`
   - **Brave:** `brave://extensions`

3. Enable **Developer Mode** (toggle in the top-right corner).

4. Click **"Load unpacked"** and select the cloned `Bandit` folder.

5. The Bandit extension icon will appear in your browser toolbar.

---

## How It Works

When you open an email, Bandit's `content.js` script analyzes the message in real time. It evaluates:

- **Sender domain** — Does it match the claimed organization?
- **Subject line** — Are urgency or manipulation tactics present?
- **Links** — Do URLs redirect through suspicious domains?
- **Attachments** — Are file types commonly used in phishing?
- **Message structure** — Grammar, formatting, and tone red flags

The result is displayed in the popup as a risk percentage with a plain-language explanation.

---

## Roadmap

- [ ] Support for additional email services (Gmail, Outlook, Yahoo Mail)
- [ ] AI-powered analysis for more nuanced detection
- [ ] Corporate API integration
- [ ] Subscription tiers (Individual / Team / Enterprise)
- [ ] Multi-language support

---

## Known Limitations

- **False positives/negatives:** Striking the right balance is an ongoing challenge. Excessive warnings can lead to alert fatigue, so the detection algorithm is continuously being refined.
- **Human factor:** Technology can help, but user behavior remains the most critical variable. Bandit addresses this through education alongside protection.

---

## Team

Built by **Catan Lords** — a team passionate about making cybersecurity accessible and understandable for everyone.

---

## License

This project is currently unlicensed. Contact the repository owner for usage permissions.

---

*Bandit moves the threat — onto the fraudsters.*
