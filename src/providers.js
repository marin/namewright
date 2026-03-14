export const PROVIDERS = {
  groq: {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
      "gemma2-9b-it",
    ],
    signupUrl: "https://console.groq.com/keys",
    note: "Free tier — very fast inference, generous limits",
    headers: (key) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    }),
    body: (messages, model, system) => ({
      model,
      max_tokens: 4096,
      messages: [{ role: "system", content: system }, ...messages],
    }),
    extract: (data) => data.choices?.[0]?.message?.content || "",
  },
  together: {
    name: "Together.ai",
    url: "https://api.together.xyz/v1/chat/completions",
    defaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    models: [
      "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
    ],
    signupUrl: "https://api.together.xyz/settings/api-keys",
    note: "Free credits on signup — wide model selection",
    headers: (key) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    }),
    body: (messages, model, system) => ({
      model,
      max_tokens: 4096,
      messages: [{ role: "system", content: system }, ...messages],
    }),
    extract: (data) => data.choices?.[0]?.message?.content || "",
  },
  openrouter: {
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    models: [
      "meta-llama/llama-3.3-70b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "google/gemma-2-9b-it:free",
    ],
    signupUrl: "https://openrouter.ai/keys",
    note: "Some models are completely free — universal router",
    headers: (key) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    }),
    body: (messages, model, system) => ({
      model,
      max_tokens: 4096,
      messages: [{ role: "system", content: system }, ...messages],
    }),
    extract: (data) => data.choices?.[0]?.message?.content || "",
  },
  google: {
    name: "Google AI Studio",
    url: null,
    defaultModel: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
    signupUrl: "https://aistudio.google.com/app/apikey",
    note: "Free tier with generous limits for Gemini models",
    headers: () => ({ "Content-Type": "application/json" }),
    getUrl: (model, key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    body: (messages, _model, system) => ({
      system_instruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: 4096 },
    }),
    extract: (data) =>
      data.candidates?.[0]?.content?.parts?.[0]?.text || "",
  },
};

export const PHASES = [
  {
    id: 1,
    label: "Strategic Briefing",
    icon: "◆",
    desc: "Establishing the strategic foundation before any names are generated.",
  },
  {
    id: 2,
    label: "Territory Mapping",
    icon: "◎",
    desc: "Analyzing the competitive landscape to find naming white space.",
  },
  {
    id: 3,
    label: "Name Generation",
    icon: "✦",
    desc: "Generating divergent candidates across three creative tracks.",
  },
  {
    id: 4,
    label: "Evaluation",
    icon: "▣",
    desc: "Evaluating candidates with SMILE and SCRATCH frameworks.",
  },
  {
    id: 5,
    label: "Shortlist",
    icon: "◈",
    desc: "Presenting finalists in real-world context for your decision.",
  },
];

export const PHASE_PROMPTS = {
  2: "Let's move to Phase 2: Territory Mapping. Analyze the competitive naming landscape based on what we've discussed and identify the white space.",
  3: "Time for Phase 3: Multi-Track Name Generation. Generate 18-24 name candidates across three creative tracks (Core Team, Multiplier Team, Excursion Team). For each, provide the name, track, rationale, and phonosemantic note.",
  4: "Now Phase 4: Evaluation & Scoring. Evaluate the generated names using the SMILE test (score 1-5 each) and SCRATCH test. Present a scored evaluation table and identify the top 5-7 names.",
  5: "Finally, Phase 5: Shortlist & Refinement. Present the top finalists in real-world context with headline tests, introduction tests, t-shirt tests. Include full rationale, phonosemantic profile, and decision guidance.",
};
