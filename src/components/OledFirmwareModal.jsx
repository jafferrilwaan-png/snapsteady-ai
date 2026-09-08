import React, { useState } from 'react';
import { X, Copy, Check, Cpu, Terminal } from 'lucide-react';

const ESP32_OLED_SKETCH = `/*
 * A.U.R.A. TACTICAL NODE-01 - ESP32 128x64 OLED HUD FIRMWARE
 * Hardware: ESP32 + 0.96" SSD1306 OLED (I2C: SDA=GPIO21, SCL=GPIO22)
 * Libraries needed: Adafruit SSD1306, Adafruit GFX, ArduinoJson, WebServer
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);

// Global HUD State
int currentScreen = 0;       // 0 = HUD, 1 = Bio, 2 = Lockdown
String currentMessage = "STANDBY";
float currentDepth = 3.8;
int currentBpm = 16;
int currentConfidence = 88;

void sendCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void drawHUD() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  
  if (currentScreen == 0) {
    // 0: Tactical HUD
    display.drawRect(0, 0, 128, 64, SSD1306_WHITE);
    display.fillRect(0, 0, 128, 10, SSD1306_WHITE);
    display.setTextColor(SSD1306_BLACK);
    display.setTextSize(1);
    display.setCursor(3, 1);
    display.print("A.U.R.A. HUD // 01");
    
    display.setTextColor(SSD1306_WHITE);
    // Reticle
    display.drawCircle(22, 28, 11, SSD1306_WHITE);
    display.drawFastHLine(7, 28, 6, SSD1306_WHITE);
    display.drawFastHLine(31, 28, 6, SSD1306_WHITE);
    display.drawFastVLine(22, 13, 6, SSD1306_WHITE);
    display.drawFastVLine(22, 37, 6, SSD1306_WHITE);
    
    // Telemetry
    display.setCursor(42, 15);
    display.printf("DPTH:%.1fm", currentDepth);
    display.setCursor(42, 25);
    display.printf("CONF:%d%%", currentConfidence);
    display.setCursor(42, 35);
    display.printf("PULS:%dBPM", currentBpm);
    
    // Bottom banner
    display.drawFastHLine(0, 48, 128, SSD1306_WHITE);
    display.setCursor(4, 52);
    display.print("> ");
    display.print(currentMessage.substring(0, 18));
  } 
  else if (currentScreen == 1) {
    // 1: Bio-Waveform
    display.fillRect(0, 0, 128, 10, SSD1306_WHITE);
    display.setTextColor(SSD1306_BLACK);
    display.setCursor(3, 1);
    display.printf("BIO-VITALS // %d BPM", currentBpm);
    
    display.setTextColor(SSD1306_WHITE);
    // Draw running ECG waveform
    int baseline = 34;
    for (int x = 2; x < 126; x++) {
      int y = baseline;
      int t = (x + (millis() / 20)) % 60;
      if (t >= 20 && t < 23) y -= 16;
      else if (t >= 23 && t < 26) y += 6;
      else if (t >= 32 && t < 38) y -= 4;
      display.drawPixel(x, y, SSD1306_WHITE);
    }
    display.drawFastHLine(0, 48, 128, SSD1306_WHITE);
    display.setCursor(4, 52);
    display.printf("STATUS: %s", currentMessage.substring(0, 14).c_str());
  } 
  else if (currentScreen == 2) {
    // 2: Lockdown Alert
    bool flash = (millis() / 250) % 2 == 0;
    if (flash) {
      display.fillRect(0, 0, 128, 64, SSD1306_WHITE);
      display.setTextColor(SSD1306_BLACK);
    } else {
      display.drawRect(0, 0, 128, 64, SSD1306_WHITE);
      display.setTextColor(SSD1306_WHITE);
    }
    display.setTextSize(1);
    display.setCursor(10, 8);
    display.print("! ! LOCKDOWN ! !");
    display.setCursor(14, 24);
    display.print(currentMessage.substring(0, 16));
    display.setCursor(14, 38);
    display.printf("DEPTH:%.1fm | %d%%", currentDepth, currentConfidence);
    display.setCursor(10, 52);
    display.print("LETHAL AUTH: YES");
  }
  display.display();
}

void handlePostOled() {
  sendCorsHeaders();
  if (server.hasArg("plain") == false) {
    server.send(400, "application/json", "{\\"error\\":\\"Missing body\\"}");
    return;
  }
  String body = server.arg("plain");
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, body);
  if (error) {
    server.send(400, "application/json", "{\\"error\\":\\"Invalid JSON\\"}");
    return;
  }
  
  if (doc.containsKey("screen")) currentScreen = doc["screen"];
  if (doc.containsKey("message")) currentMessage = doc["message"].as<String>();
  if (doc.containsKey("depth")) currentDepth = doc["depth"];
  if (doc.containsKey("bpm")) currentBpm = doc["bpm"];
  if (doc.containsKey("confidence")) currentConfidence = doc["confidence"];
  
  drawHUD();
  server.send(200, "application/json", "{\\"status\\":\\"success\\",\\"screen\\":currentScreen}");
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 25);
  display.print("Connecting WiFi...");
  display.display();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
  }

  server.on("/api/oled", HTTP_POST, handlePostOled);
  server.on("/api/oled", HTTP_OPTIONS, []() {
    sendCorsHeaders();
    server.send(204);
  });
  server.begin();
  drawHUD();
}

void loop() {
  server.handleClient();
  if (currentScreen == 1 || currentScreen == 2) {
    static unsigned long lastRefresh = 0;
    if (millis() - lastRefresh > 80) {
      drawHUD();
      lastRefresh = millis();
    }
  }
}
`;

export default function OledFirmwareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ESP32_OLED_SKETCH);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-white/20 rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                ESP32 SSD1306 OLED HUD Firmware
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  I2C (21, 22)
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Endpoint: POST /api/oled &bull; ArduinoJson + Adafruit_SSD1306
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-colors shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto bg-black/90 flex-1 font-mono text-xs text-slate-300 leading-relaxed select-all">
          <pre className="text-slate-300 whitespace-pre-wrap">{ESP32_OLED_SKETCH}</pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Default Target Node IP: 172.21.169.16
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
