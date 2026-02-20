function addScanButton() {
    const button = document.createElement("button");
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
        alert("Analiza pokrenuta!");
    });

    document.body.appendChild(button);
}

addScanButton();