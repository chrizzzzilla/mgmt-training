# ChatGPT Clone - n8n Integration

Eine moderne React-Chat-Anwendung mit ChatGPT-ähnlichem Interface, die für die Integration mit n8n Webhooks konzipiert ist.

## Features

- 🎨 Modernes, ChatGPT-ähnliches Design
- 💬 Echtzeit-Chat-Interface
- 🔗 n8n Webhook-Integration
- ⚙️ Konfigurierbare Einstellungen
- 📱 Responsive Design
- 🎯 TypeScript-Unterstützung

## Installation

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Anwendung starten:**
   ```bash
   npm start
   ```

3. **Browser öffnen:**
   Die Anwendung ist unter `http://localhost:3000` verfügbar.

## n8n Integration

### Webhook-Konfiguration

1. Öffnen Sie die Einstellungen in der Chat-Anwendung (Zahnrad-Symbol)
2. Geben Sie Ihre n8n Webhook-URL ein
3. Optional: Fügen Sie einen API-Schlüssel hinzu

### n8n Workflow Setup

Erstellen Sie einen n8n Workflow mit einem Webhook-Trigger:

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "chatbot",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Process Message",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Verarbeiten Sie die eingehende Nachricht\nconst message = $input.first().json.message;\n\n// Hier können Sie Ihre Chatbot-Logik implementieren\n// z.B. OpenAI API, lokales LLM, etc.\n\nconst response = {\n  response: `Sie haben gesagt: ${message}`\n};\n\nreturn [{ json: response }];"
      }
    },
    {
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      }
    }
  ]
}
```

### Erwartetes Datenformat

**Eingehende Nachricht (von React-App):**
```json
{
  "message": "Hallo, wie geht es dir?",
  "conversationId": "default",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Antwort (an React-App):**
```json
{
  "response": "Hallo! Mir geht es gut, danke der Nachfrage. Wie kann ich Ihnen helfen?"
}
```

## Projektstruktur

```
src/
├── components/          # React-Komponenten
│   ├── ChatHeader.tsx   # Header mit Titel und Einstellungen
│   ├── ChatInput.tsx    # Eingabefeld für Nachrichten
│   ├── MessageBubble.tsx # Einzelne Nachrichtenblase
│   └── SettingsModal.tsx # Einstellungsmodal
├── hooks/
│   └── useChat.ts       # Chat-Logik und n8n-Integration
├── types/
│   └── chat.ts          # TypeScript-Typen
├── App.tsx              # Hauptkomponente
├── index.tsx            # App-Einstiegspunkt
└── index.css            # Globale Styles
```

## Anpassungen

### Styling
Das Design verwendet Tailwind CSS. Sie können die Farben in `tailwind.config.js` anpassen:

```javascript
theme: {
  extend: {
    colors: {
      'chat-bg': '#343541',        // Hintergrundfarbe
      'chat-sidebar': '#202123',   // Seitenleiste
      'chat-input': '#40414f',     // Eingabefeld
      // ... weitere Farben
    }
  }
}
```

### API-Integration
Die n8n-Integration erfolgt in `src/hooks/useChat.ts`. Sie können die Anfrage-Parameter und das Antwortformat an Ihre Bedürfnisse anpassen.

## Build für Produktion

```bash
npm run build
```

Die optimierte Version wird im `build/`-Verzeichnis erstellt.

## Lizenz

MIT License - Sie können dieses Projekt frei verwenden und anpassen.
