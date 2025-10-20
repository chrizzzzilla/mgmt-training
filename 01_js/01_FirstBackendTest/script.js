// Script für die Verwaltung der Zahlendaten
class DataManager {
    constructor() {
        this.dataFile = 'data.json';
        this.storageKey = 'numberData';
    }

    // Daten aus der JSON-Datei laden (falls möglich) oder aus localStorage
    async loadData() {
        try {
            // Versuche zuerst aus der lokalen JSON-Datei zu laden
            const response = await fetch(this.dataFile);
            if (response.ok) {
                const fileData = await response.json();
                console.log('Daten aus data.json geladen:', fileData);
                
                // Synchronisiere mit localStorage falls dort neuere Daten sind
                const localData = localStorage.getItem(this.storageKey);
                if (localData) {
                    const parsedLocal = JSON.parse(localData);
                    if (parsedLocal.numbers.length > fileData.numbers.length) {
                        console.log('LocalStorage hat neuere Daten, verwende diese');
                        return parsedLocal;
                    }
                }
                
                // Speichere Datei-Daten auch in localStorage
                localStorage.setItem(this.storageKey, JSON.stringify(fileData));
                return fileData;
            }
        } catch (error) {
            console.log('Kann data.json nicht laden:', error.message);
        }
        
        // Fallback: Lade aus localStorage
        const localData = localStorage.getItem(this.storageKey);
        if (localData) {
            console.log('Daten aus localStorage geladen');
            return JSON.parse(localData);
        }
        
        // Fallback: Erstelle neue leere Struktur
        console.log('Erstelle neue Datenstruktur');
        return {
            numbers: [],
            lastUpdated: null,
            totalEntries: 0
        };
    }

    // Neue Zahl hinzufügen und speichern
    async saveNumber(number) {
        try {
            const data = await this.loadData();
            
            // Zahl zum Array hinzufügen
            data.numbers.push(number);
            data.totalEntries = data.numbers.length;
            data.lastUpdated = new Date().toISOString();

            // In localStorage speichern
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            // Zeige dem User an, dass er die Daten manuell in data.json kopieren sollte
            this.showSyncHint(data);
            
            console.log('Zahl gespeichert:', number);
            console.log('Aktuelle Daten:', data);
            
            return data;
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            throw error;
        }
    }

    // Hinweis zum manuellen Synchronisieren anzeigen
    showSyncHint(data) {
        if (data.totalEntries % 5 === 0) { // Zeige Hinweis alle 5 Einträge
            const hint = document.querySelector('.sync-hint');
            if (!hint) {
                const hintDiv = document.createElement('div');
                hintDiv.className = 'sync-hint';
                hintDiv.innerHTML = `
                    <p><strong>💡 Hinweis:</strong> Um die Daten dauerhaft zu speichern, kopiere den Inhalt in deine data.json Datei:</p>
                    <button onclick="dataManager.copyToClipboard()" class="copy-btn">📋 JSON kopieren</button>
                `;
                const container = document.querySelector('.container');
                container.appendChild(hintDiv);
                
                // Hinweis nach 10 Sekunden ausblenden
                setTimeout(() => {
                    hintDiv.remove();
                }, 10000);
            }
        }
    }

    // JSON-Daten in Zwischenablage kopieren
    async copyToClipboard() {
        const data = await this.getAllNumbers();
        const jsonString = JSON.stringify(data, null, 2);
        
        try {
            await navigator.clipboard.writeText(jsonString);
            showMessage('JSON-Daten in Zwischenablage kopiert! Füge sie in data.json ein.', 'success');
        } catch (error) {
            // Fallback für ältere Browser
            const textarea = document.createElement('textarea');
            textarea.value = jsonString;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showMessage('JSON-Daten kopiert! Füge sie manuell in data.json ein.', 'success');
        }
    }

    // Alle gespeicherten Zahlen abrufen
    async getAllNumbers() {
        return await this.loadData();
    }

    // Manuelle Synchronisation mit data.json
    async syncWithFile() {
        const data = await this.getAllNumbers();
        const jsonString = JSON.stringify(data, null, 2);
        
        // Erstelle Download-Link für die aktualisierte JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showMessage('data.json heruntergeladen! Ersetze die alte Datei damit.', 'info');
    }
}

// Globale Instanz des DataManagers
const dataManager = new DataManager();

// Hauptfunktion für Button-Klick
async function handleClick() {
    const input = document.getElementById('userInput');
    const value = input.value.trim();
    
    if (!value) {
        showMessage('Bitte gib zuerst eine Zahl ein!', 'error');
        return;
    }

    // Prüfen ob es eine gültige Zahl ist
    const number = parseFloat(value);
    if (isNaN(number)) {
        showMessage('Bitte gib eine gültige Zahl ein!', 'error');
        return;
    }

    try {
        // Zahl speichern
        const data = await dataManager.saveNumber(number);
        
        // Erfolgreiche Speicherung anzeigen
        showMessage(`Zahl ${number} gespeichert! (Gesamt: ${data.totalEntries})`, 'success');
        
        // Input-Feld leeren
        input.value = '';
        
        // Statistik aktualisieren
        updateStats(data);
        
    } catch (error) {
        showMessage('Fehler beim Speichern der Zahl!', 'error');
        console.error(error);
    }
}

// Nachricht anzeigen
function showMessage(message, type = 'info') {
    // Entferne alte Nachrichten
    const oldMessage = document.querySelector('.message');
    if (oldMessage) {
        oldMessage.remove();
    }

    // Erstelle neue Nachricht
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Füge Nachricht nach dem Container ein
    const container = document.querySelector('.container');
    container.appendChild(messageDiv);
    
    // Nachricht nach 3 Sekunden ausblenden
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Statistik aktualisieren
function updateStats(data) {
    let statsDiv = document.querySelector('.stats');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.className = 'stats';
        const container = document.querySelector('.container');
        container.appendChild(statsDiv);
    }
    
    const average = data.numbers.length > 0 
        ? (data.numbers.reduce((a, b) => a + b, 0) / data.numbers.length).toFixed(2)
        : 0;
    
    statsDiv.innerHTML = `
        <h3>Statistik</h3>
        <p>Anzahl Zahlen: ${data.totalEntries}</p>
        <p>Durchschnitt: ${average}</p>
        <p>Letzte Zahlen: ${data.numbers.slice(-3).join(', ')}</p>
        <div class="button-group">
            <button onclick="dataManager.copyToClipboard()" class="copy-btn">📋 JSON kopieren</button>
            <button onclick="dataManager.syncWithFile()" class="download-btn">💾 data.json aktualisieren</button>
        </div>
    `;
}

// Beim Laden der Seite Statistik anzeigen
document.addEventListener('DOMContentLoaded', async function() {
    const data = await dataManager.getAllNumbers();
    if (data.totalEntries > 0) {
        updateStats(data);
    }
});

// Enter-Taste Unterstützung
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('userInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleClick();
            }
        });
    }
});