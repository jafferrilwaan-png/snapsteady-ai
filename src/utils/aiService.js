// AI Service supporting OpenRouter Streaming with user API Key + Multi-Model Failover
export const OPENROUTER_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENROUTER_API_KEY) ||
  (typeof window !== 'undefined' && (window.OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key'))) ||
  "";

export const AVAILABLE_MODELS = [
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)", provider: "Google" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", provider: "Meta" },
  { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B (Fast Free)", provider: "Meta" },
  { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Free)", provider: "Mistral" },
  { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B (Free)", provider: "Qwen" }
];

const FALLBACK_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free"
];

async function callSingleModel({ messages, model, apiKey, onChunk, signal }) {
  const activeKey = apiKey || OPENROUTER_API_KEY;
  const systemPrompt = `You are SnapSteady AI Agent — an autonomous camera and vision intelligence assistant built for the iQOO Hackathon.
You act on camera commands (zoom, shutter, framing, lighting, stability).
Keep answers crisp, concise (under 2 sentences), actionable, and friendly for voice speech synthesis.`;

  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${activeKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://snapsteady.iqoo.hackathon",
      "X-Title": "SnapSteady AI Hackathon Edition"
    },
    body: JSON.stringify({
      model: model,
      messages: formattedMessages,
      temperature: 0.7,
      stream: true
    }),
    signal
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter (${model}) status ${response.status}: ${errText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const dataStr = trimmed.replace("data: ", "");
        if (dataStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(dataStr);
          const content = parsed.choices?.[0]?.delta?.content || "";
          if (content) {
            accumulatedText += content;
            if (onChunk) onChunk(accumulatedText);
          }
        } catch (e) {
          // parse next
        }
      }
    }
  }

  return accumulatedText;
}

export async function streamOpenRouterChat({
  messages,
  model = "google/gemini-2.0-flash-exp:free",
  apiKey = OPENROUTER_API_KEY,
  onChunk,
  signal
}) {
  const modelsToTry = [model, ...FALLBACK_MODELS.filter(m => m !== model)];

  let lastError = null;
  for (const currentModel of modelsToTry) {
    try {
      const result = await callSingleModel({
        messages,
        model: currentModel,
        apiKey,
        onChunk,
        signal
      });
      if (result && result.trim()) {
        return result;
      }
    } catch (err) {
      console.warn(`Model ${currentModel} failed, trying next fallback...`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("All AI endpoints failed");
}
