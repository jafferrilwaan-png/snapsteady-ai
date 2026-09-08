import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Cpu } from 'lucide-react';

const ESP32_SKETCH = `/*
 * ESP32 Onboard LED Web Controller Firmware
 * Compatible with React Web UI
 * Onboard LED is typically on GPIO 2
 */

#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// LED Pin (GPIO 2 is default onboard LED on most ESP32 Dev modules)
const int LED_PIN = 2;

WebServer server(80);

void sendCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
}

void handleRoot() {
  sendCorsHeaders();
  server.send(200, "application/json", "{\\"status\\":\\"online\\",\\"device\\":\\"ESP32-LED-Controller\\"}");
}

void handleLedOn() {
  digitalWrite(LED_PIN, HIGH);
  sendCorsHeaders();
  server.send(200, "application/json", "{\\"led\\":\\"ON\\",\\"state\\":1}");
}

void handleLedOff() {
  digitalWrite(LED_PIN, LOW);
  sendCorsHeaders();
  server.send(200, "application/json", "{\\"led\\":\\"OFF\\",\\"state\\":0}");
}

void handleOptions() {
  sendCorsHeaders();
  server.send(204);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Connect to Wi-Fi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("ESP32 IP Address: http://");
  Serial.println(WiFi.localIP());

  // Setup Routes (Accepts both GET and POST)
  server.on("/", HTTP_GET, handleRoot);
  server.on("/led/on", HTTP_GET, handleLedOn);
  server.on("/led/on", HTTP_POST, handleLedOn);
  server.on("/led/off", HTTP_GET, handleLedOff);
  server.on("/led/off", HTTP_POST, handleLedOff);
  
  // CORS Preflight
  server.on("/led/on", HTTP_OPTIONS, handleOptions);
  server.on("/led/off", HTTP_OPTIONS, handleOptions);

  server.begin();
  Serial.println("HTTP Server started");
}

void loop() {
  server.handleClient();
}
`;

export default function Esp32CodeSnippetModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ESP32_SKETCH);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans">
                ESP32 Arduino C++ Firmware Sketch
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Endpoints: /led/on, /led/off with CORS support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-semibold font-mono transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-4 overflow-y-auto bg-slate-950 flex-1 font-mono text-xs text-slate-300 leading-relaxed select-all">
          <pre className="text-slate-300 whitespace-pre-wrap">{ESP32_SKETCH}</pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Default IP: 172.21.169.16 / GPIO 2
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
