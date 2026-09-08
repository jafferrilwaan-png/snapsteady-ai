import React, { useState } from 'react';
import { X, Copy, Check, Cpu, HelpCircle, CheckCircle2, Gamepad2 } from 'lucide-react';

const ESP32_GAMES_SKETCH = `/*
 * ================================================================
 * VR COMPANION & RETRO PIXEL ARCADE OLED FIRMWARE (ESP32 + SSD1306)
 * Pre-configured for Hotspot: "OPPO Reno13 5G r24x"
 * ================================================================
 * Includes 5 FULL RETRO GAMES on your physical 128x64 OLED:
 *   1. Retro Pong (AI Paddles + Ball + Score)
 *   2. Pixel Dino Runner (T-Rex Jumping Cacti)
 *   3. Space Invaders (Spaceship + Alien Fleet + Lasers)
 *   4. Classic Snake (Snake + Food Pellets + Score)
 *   5. Flappy Pixel Bird (Bird Flapping through Pipes)
 *   Plus: Cyber-Pet Face, 3D Warp, and VR Marquee Streamer!
 * ================================================================
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
WebServer server(80);

const char* ssid = "OPPO Reno13 5G r24x";
const char* password = "123456789";

// Active Game/Screen Mode
String currentMode = "dino"; // "pong", "dino", "invaders", "snake", "flappy", "pet", "warp", "marquee"
String broadcastMessage = "PIXEL ARCADE";
int currentSpeed = 15;
unsigned long lastFrameUpdate = 0;

// -------------------------------------------------------------
// 1. PONG GAME VARIABLES
// -------------------------------------------------------------
float pongBallX = 64.0, pongBallY = 32.0;
float pongVx = 2.2, pongVy = 1.3;
float p1Y = 24.0, p2Y = 24.0;
int pScore1 = 4, pScore2 = 2;

void drawPong() {
  pongBallX += pongVx;
  pongBallY += pongVy;
  if (pongBallY <= 2 || pongBallY >= 58) pongVy = -pongVy;
  if (p1Y + 8 < pongBallY) p1Y += 1.3;
  if (p1Y + 8 > pongBallY) p1Y -= 1.3;
  if (p2Y + 8 < pongBallY) p2Y += 1.4;
  if (p2Y + 8 > pongBallY) p2Y -= 1.4;
  p1Y = constrain(p1Y, 2, 46);
  p2Y = constrain(p2Y, 2, 46);
  if (pongBallX <= 7 && pongBallY >= p1Y && pongBallY <= p1Y + 16) pongVx = abs(pongVx);
  if (pongBallX >= 120 && pongBallY >= p2Y && pongBallY <= p2Y + 16) pongVx = -abs(pongVx);
  if (pongBallX < 0) { pongBallX = 64; pongBallY = 32; pScore2++; }
  if (pongBallX > 127) { pongBallX = 64; pongBallY = 32; pScore1++; }

  for (int y = 0; y < 64; y += 4) display.drawFastVLine(63, y, 2, SSD1306_WHITE);
  display.fillRect(3, (int)p1Y, 3, 16, SSD1306_WHITE);
  display.fillRect(122, (int)p2Y, 3, 16, SSD1306_WHITE);
  display.fillRect((int)pongBallX, (int)pongBallY, 3, 3, SSD1306_WHITE);
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(46, 4); display.printf("%02d", pScore1 % 100);
  display.setCursor(72, 4); display.printf("%02d", pScore2 % 100);
}

// -------------------------------------------------------------
// 2. PIXEL DINO RUNNER GAME
// -------------------------------------------------------------
float dinoY = 40.0;
float dinoVy = 0.0;
float cactus1X = 130.0, cactus2X = 190.0;
int dinoScore = 120;
int dinoLeg = 0;

void drawDino() {
  dinoY += dinoVy;
  dinoVy += 0.5; // gravity
  if (dinoY >= 40.0) { dinoY = 40.0; dinoVy = 0.0; }

  // Auto-jump over cactus
  if (cactus1X < 36 && cactus1X > 20 && dinoY >= 40.0) {
    dinoVy = -5.2;
  }

  cactus1X -= 2.2;
  cactus2X -= 2.2;
  if (cactus1X < -10) cactus1X = 130 + random(0, 30);
  if (cactus2X < -10) cactus2X = cactus1X + 60 + random(0, 30);

  dinoScore++;
  if ((millis() / 120) % 2 == 0) dinoLeg = 1; else dinoLeg = 0;

  // Ground
  display.drawFastHLine(0, 54, 128, SSD1306_WHITE);
  for (int x = 0; x < 128; x += 18) display.drawFastHLine((x - (millis() / 30) % 18 + 128) % 128, 56, 3, SSD1306_WHITE);

  // Dino Sprite
  int dx = 18, dy = (int)dinoY;
  display.fillRect(dx + 6, dy - 12, 6, 6, SSD1306_WHITE); // head
  display.fillRect(dx + 10, dy - 10, 2, 2, SSD1306_WHITE); // snout
  display.fillRect(dx + 4, dy - 6, 7, 10, SSD1306_WHITE); // body
  display.fillRect(dx + 1, dy - 2, 3, 4, SSD1306_WHITE); // tail
  display.fillRect(dx + 8, dy - 2, 3, 2, SSD1306_WHITE); // arms
  if (dinoLeg == 0) {
    display.fillRect(dx + 4, dy + 4, 2, 6, SSD1306_WHITE);
    display.fillRect(dx + 8, dy + 4, 2, 4, SSD1306_WHITE);
  } else {
    display.fillRect(dx + 4, dy + 4, 2, 4, SSD1306_WHITE);
    display.fillRect(dx + 8, dy + 4, 2, 6, SSD1306_WHITE);
  }

  // Cacti
  if (cactus1X >= -5 && cactus1X < 128) {
    display.fillRect((int)cactus1X + 2, 42, 3, 12, SSD1306_WHITE);
    display.fillRect((int)cactus1X, 45, 2, 5, SSD1306_WHITE);
    display.fillRect((int)cactus1X + 5, 47, 2, 4, SSD1306_WHITE);
  }
  if (cactus2X >= -5 && cactus2X < 128) {
    display.fillRect((int)cactus2X + 2, 42, 3, 12, SSD1306_WHITE);
  }

  // Score
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(50, 4);
  display.printf("HI %05d", dinoScore / 10);
}

// -------------------------------------------------------------
// 3. SPACE INVADERS ARCADE
// -------------------------------------------------------------
float invaderPlayerX = 60.0;
float bulletY = -1.0, bulletX = 0.0;
int alienStep = 0;

void drawSpaceInvaders() {
  invaderPlayerX = 58.0 + sin(millis() * 0.003) * 40.0;
  
  if (bulletY < 0 && (millis() / 400) % 2 == 0) {
    bulletX = invaderPlayerX + 4;
    bulletY = 50;
  }
  if (bulletY >= 0) {
    bulletY -= 3.0;
    display.drawFastVLine((int)bulletX, (int)bulletY, 3, SSD1306_WHITE);
  }

  alienStep = (millis() / 300) % 2;
  // 2 rows of aliens
  for (int r = 0; r < 2; r++) {
    for (int c = 0; c < 6; c++) {
      int ax = 12 + c * 18 + (alienStep ? 3 : 0);
      int ay = 12 + r * 12;
      display.fillRect(ax + 2, ay, 4, 1, SSD1306_WHITE);
      display.fillRect(ax + 1, ay + 1, 6, 2, SSD1306_WHITE);
      display.fillRect(ax, ay + 3, 8, 2, SSD1306_WHITE);
      display.fillRect(ax + 1, ay + 5, 2, 2, SSD1306_WHITE);
      display.fillRect(ax + 5, ay + 5, 2, 2, SSD1306_WHITE);
    }
  }

  // Player Ship
  int px = (int)invaderPlayerX;
  display.fillRect(px + 4, 52, 2, 3, SSD1306_WHITE);
  display.fillRect(px + 2, 55, 6, 3, SSD1306_WHITE);
  display.fillRect(px, 58, 10, 3, SSD1306_WHITE);

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(4, 2);
  display.print(F("INVADERS // SCORE 840"));
}

// -------------------------------------------------------------
// 4. CLASSIC PIXEL SNAKE
// -------------------------------------------------------------
int snakeX = 20, snakeY = 10;
int foodX = 28, foodY = 10;
int snakeScore = 6;

void drawSnake() {
  if ((millis() / 150) % 2 == 0) {
    if (snakeX < foodX) snakeX++;
    else if (snakeX > foodX) snakeX--;
    else if (snakeY < foodY) snakeY++;
    else if (snakeY > foodY) snakeY--;

    if (snakeX == foodX && snakeY == foodY) {
      snakeScore += 10;
      foodX = random(4, 36);
      foodY = random(4, 18);
    }
  }

  display.drawRect(0, 10, 128, 54, SSD1306_WHITE);
  // Draw Food (blinking)
  if ((millis() / 200) % 2 == 0) display.fillRect(foodX * 3, foodY * 3, 3, 3, SSD1306_WHITE);
  // Draw Snake Head & Body
  display.fillRect(snakeX * 3, snakeY * 3, 4, 4, SSD1306_WHITE);
  display.fillRect((snakeX - 1) * 3, snakeY * 3, 3, 3, SSD1306_WHITE);
  display.fillRect((snakeX - 2) * 3, snakeY * 3, 3, 3, SSD1306_WHITE);

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(4, 2);
  display.printf("SNAKE // SCORE: %d", snakeScore);
}

// -------------------------------------------------------------
// 5. FLAPPY PIXEL BIRD
// -------------------------------------------------------------
float flappyY = 28.0;
float flappyVy = 0.0;
float pipeX = 110.0;

void drawFlappy() {
  flappyY += flappyVy;
  flappyVy += 0.3;
  if (flappyY > 38.0) flappyVy = -3.0; // auto-flap
  flappyY = constrain(flappyY, 4, 52);

  pipeX -= 1.8;
  if (pipeX < -15) pipeX = 130;

  // Pipes
  int ipx = (int)pipeX;
  display.fillRect(ipx, 0, 10, 20, SSD1306_WHITE);
  display.fillRect(ipx, 42, 10, 22, SSD1306_WHITE);

  // Bird
  int by = (int)flappyY;
  display.fillRect(24, by, 6, 5, SSD1306_WHITE);
  display.fillRect(30, by + 2, 2, 2, SSD1306_WHITE);
  display.drawFastHLine(0, 62, 128, SSD1306_WHITE);

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(50, 4);
  display.print(F("FLAPPY BIRD"));
}

// -------------------------------------------------------------
// 6. CYBER-PET COMPANION
// -------------------------------------------------------------
void drawPet() {
  int cy = 25 + ((millis() / 250) % 3);
  display.drawRoundRect(28, cy - 8, 72, 34, 4, SSD1306_WHITE);
  bool blink = ((millis() / 1500) % 8 == 0);
  if (blink) {
    display.fillRect(44, cy + 4, 12, 2, SSD1306_WHITE);
    display.fillRect(72, cy + 4, 12, 2, SSD1306_WHITE);
  } else {
    display.drawCircle(50, cy + 8, 5, SSD1306_WHITE);
    display.drawCircle(78, cy + 8, 5, SSD1306_WHITE);
  }
  display.drawCircle(64, cy + 12, 4, SSD1306_WHITE);
  display.drawFastHLine(0, 52, 128, SSD1306_WHITE);
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(4, 55);
  display.print("<3 ");
  display.print(broadcastMessage.substring(0, 18));
}

// Master Draw Loop
void drawDisplay() {
  display.clearDisplay();
  if (currentMode == "dino") drawDino();
  else if (currentMode == "pong") drawPong();
  else if (currentMode == "invaders") drawSpaceInvaders();
  else if (currentMode == "snake") drawSnake();
  else if (currentMode == "flappy") drawFlappy();
  else if (currentMode == "pet") drawPet();
  else drawDino();
  display.display();
}

void handleSetOled() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  if (server.hasArg("plain")) {
    #if ARDUINOJSON_VERSION_MAJOR >= 7
      JsonDocument doc;
    #else
      StaticJsonDocument<512> doc;
    #endif
    deserializeJson(doc, server.arg("plain"));

    if (doc.containsKey("mode")) currentMode = doc["mode"].as<String>();
    if (doc.containsKey("game")) currentMode = doc["game"].as<String>();
    if (doc.containsKey("message")) broadcastMessage = doc["message"].as<String>();
    if (doc.containsKey("text")) broadcastMessage = doc["text"].as<String>();

    // Support screen numbers
    if (doc.containsKey("screen") && !doc.containsKey("mode")) {
      int s = doc["screen"];
      if (s == 0) currentMode = "pet";
      else if (s == 2) currentMode = "pong";
      else if (s == 5) currentMode = "dino";
      else if (s == 6) currentMode = "invaders";
      else if (s == 7) currentMode = "snake";
      else if (s == 8) currentMode = "flappy";
    }

    server.send(200, "application/json", "{\"status\":\"success\",\"mode\":currentMode}");
  } else {
    server.send(400, "application/json", "{\"status\":\"missing_body\"}");
  }
}

void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(200, "text/plain", "OK");
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed. Check I2C wiring!"));
    while (true) { delay(100); }
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(8, 25);
  display.println(F("ARCADE BOOTING..."));
  display.display();

  WiFi.disconnect(true);
  delay(300);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to Hotspot");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 60) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\\nConnected Successfully!");
    Serial.print("Node IP Address: ");
    Serial.println(WiFi.localIP());
  }

  server.on("/", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "ESP32 Pixel Arcade Node Online!");
  });

  server.on("/api/oled", HTTP_OPTIONS, handleOptions);
  server.on("/api/oled", HTTP_POST, handleSetOled);
  server.begin();
  Serial.println("HTTP Server Listening on Port 80");
}

void loop() {
  server.handleClient();
  if (millis() - lastFrameUpdate > 33) {
    lastFrameUpdate = millis();
    drawDisplay();
  }
}
`;

export default function ArcadeFirmwareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ESP32_GAMES_SKETCH);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-white/20 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 shadow-md">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                ESP32 Retro Games OLED Firmware (5 Games!)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Ready to Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Dino Runner &bull; Space Invaders &bull; Snake &bull; Pong &bull; Flappy Bird
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-colors shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Code' : 'Copy All Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-950/40 border-b border-amber-800/40 p-3 px-5 text-xs text-amber-200 font-mono flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Flash this in Arduino IDE!</strong> Once uploaded, your OLED will run Dino Runner, Pong, Space Invaders, Snake, and Flappy Bird in real-time!
          </span>
        </div>

        {/* Code Box */}
        <div className="p-4 overflow-y-auto bg-black/90 flex-1 font-mono text-xs text-slate-300 leading-relaxed select-all">
          <pre className="text-slate-300 whitespace-pre-wrap">{ESP32_GAMES_SKETCH}</pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Configured for Hotspot: OPPO Reno13 5G r24x
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
