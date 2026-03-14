import { useState, useRef, useEffect, useCallback } from "react";
import "./index.css";
import { PROVIDERS, PHASES, PHASE_PROMPTS } from "./providers";
import { SYSTEM_PROMPT } from "./systemPrompt";
import MarkdownRenderer from "./MarkdownRenderer";
import SettingsScreen from "./SettingsScreen";

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "0.5em 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--accent)",
            animation: `nePulse 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [config, setConfig] = useState({
    providerId: "groq",
    model: "llama-3.3-70b-versatile",
    apiKey: "",
  });
  const [phase, setPhase] = useState(1);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && screen === "session") inputRef.current?.focus();
  }, [loading, screen]);

  const callAPI = useCallback(
    async (userMsg) => {
      const history = [...messages, { role: "user", content: userMsg }];
      setMessages(history);
      setLoading(true);
      setError(null);
      try {
        const provider = PROVIDERS[config.providerId];
        const system =
          SYSTEM_PROMPT +
          `\n\nCurrent phase: Phase ${phase}. The user is naming: "${projectName}".`;
        const apiMessages = history.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const url = provider.getUrl
          ? provider.getUrl(config.model, config.apiKey)
          : provider.url;
        const res = await fetch(url, {
          method: "POST",
          headers: provider.headers(config.apiKey),
          body: JSON.stringify(
            provider.body(apiMessages, config.model, system)
          ),
        });
        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`${res.status}: ${errBody.slice(0, 200)}`);
        }
        const data = await res.json();
        const text = provider.extract(data);
        if (!text) throw new Error("Empty response from model");
        setMessages((prev) => [...prev, { role: "assistant", content: text }]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [messages, config, phase, projectName]
  );

  function startSession() {
    if (!projectName.trim()) return;
    setScreen("session");
    setPhase(1);
    setMessages([]);
    setTimeout(() => {
      callAPI(
        `I need help naming a ${projectName.trim()}. Let's begin the strategic briefing.`
      );
    }, 100);
  }

  function advancePhase() {
    const next = phase + 1;
    if (next > 5) return;
    setPhase(next);
    callAPI(PHASE_PROMPTS[next]);
  }

  function handleSend() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    callAPI(msg);
  }

  /* ─── WELCOME / SETTINGS ─── */
  if (screen === "welcome" || screen === "settings") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--fg)",
          fontFamily: "var(--font-display)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            padding: "2rem",
          }}
          className="ne-fade-up"
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: screen === "settings" ? "1.5rem" : 0,
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "var(--accent)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              Namewright
            </div>
            {screen === "welcome" && (
              <>
                <h1
                  style={{
                    fontSize: "clamp(2.4rem, 6vw, 3.6rem)",
                    fontWeight: 400,
                    lineHeight: 1.1,
                    marginBottom: "1.1rem",
                    fontStyle: "italic",
                  }}
                >
                  Every great brand
                  <br />
                  starts with a name
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    color: "var(--fg-dim)",
                    lineHeight: 1.65,
                    maxWidth: 400,
                    margin: "0 auto 2.5rem",
                    fontWeight: 300,
                  }}
                >
                  A strategic naming engine powered by linguistic science,
                  phonosemantics, and multi-track creative methodology.
                </p>
              </>
            )}
          </div>

          {screen === "welcome" ? (
            <div style={{ maxWidth: 380, margin: "0 auto" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                }}
              >
                What are you naming?
              </label>
              <input
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && projectName.trim())
                    setScreen("settings");
                }}
                placeholder="e.g. AI writing assistant, fintech startup, coffee brand..."
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--fg)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--border)")
                }
              />
              <button
                onClick={() => projectName.trim() && setScreen("settings")}
                disabled={!projectName.trim()}
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "0.85rem",
                  background: projectName.trim()
                    ? "var(--accent)"
                    : "var(--surface-alt)",
                  color: projectName.trim() ? "var(--bg)" : "var(--fg-dim)",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "var(--font-display)",
                  fontSize: "1.05rem",
                  fontStyle: "italic",
                  cursor: projectName.trim() ? "pointer" : "default",
                  transition: "all 0.25s",
                }}
              >
                Next: choose your AI provider →
              </button>
              <div
                style={{
                  marginTop: "3rem",
                  display: "flex",
                  justifyContent: "center",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                {PHASES.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.68rem",
                      color: "var(--fg-dim)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{ color: "var(--accent-dim)", fontSize: "0.6rem" }}
                    >
                      {p.icon}
                    </span>
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <SettingsScreen
              config={config}
              setConfig={setConfig}
              onDone={startSession}
            />
          )}
        </div>
      </div>
    );
  }

  /* ─── SESSION ─── */
  const provider = PROVIDERS[config.providerId];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        color: "var(--fg)",
        fontFamily: "var(--font-body)",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(10,10,12,0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          padding: "0.65rem 1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "1.05rem",
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            Namewright
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--fg-dim)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            / {projectName}
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              color: "var(--fg-dim)",
              flexShrink: 0,
              background: "var(--surface-alt)",
              padding: "2px 8px",
              borderRadius: 4,
              border: "1px solid var(--border)",
            }}
          >
            {provider.name}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            flexShrink: 0,
          }}
        >
          {PHASES.map((p) => (
            <div
              key={p.id}
              title={p.label}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.62rem",
                fontWeight: 600,
                background:
                  p.id === phase
                    ? "var(--accent)"
                    : p.id < phase
                    ? "var(--surface-alt)"
                    : "transparent",
                color:
                  p.id === phase
                    ? "var(--bg)"
                    : p.id < phase
                    ? "var(--accent)"
                    : "var(--fg-dim)",
                border: p.id <= phase ? "none" : "1px solid var(--border)",
                transition: "all 0.3s",
              }}
            >
              {p.id}
            </div>
          ))}
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1rem 9rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Phase banner */}
          <div
            className="ne-msg"
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              padding: "1.3rem",
              background: "var(--surface)",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ color: "var(--accent)", fontSize: "1.2rem" }}>
              {PHASES[phase - 1]?.icon}
            </span>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontStyle: "italic",
                margin: "0.3rem 0 0.2rem",
              }}
            >
              Phase {phase}: {PHASES[phase - 1]?.label}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--fg-dim)" }}>
              {PHASES[phase - 1]?.desc}
            </div>
          </div>

          {messages
            .filter((_, idx) => idx > 0)
            .map((m, i) => (
              <div
                key={i}
                className="ne-msg"
                style={{
                  display: "flex",
                  justifyContent:
                    m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    maxWidth: m.role === "user" ? "75%" : "88%",
                    padding:
                      m.role === "user"
                        ? "0.7rem 1rem"
                        : "1rem 1.2rem",
                    background:
                      m.role === "user"
                        ? "var(--accent)"
                        : "var(--surface)",
                    color:
                      m.role === "user" ? "var(--bg)" : "var(--fg)",
                    borderRadius:
                      m.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    fontWeight: m.role === "user" ? 500 : 400,
                    border:
                      m.role === "user"
                        ? "none"
                        : "1px solid var(--border)",
                  }}
                >
                  {m.role === "assistant" ? (
                    <MarkdownRenderer text={m.content} />
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

          {loading && (
            <div
              className="ne-msg"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  padding: "0.8rem 1.2rem",
                  background: "var(--surface)",
                  borderRadius: "16px 16px 16px 4px",
                  border: "1px solid var(--border)",
                }}
              >
                <TypingDots />
              </div>
            </div>
          )}

          {error && (
            <div
              className="ne-msg"
              style={{
                padding: "0.8rem 1rem",
                background: "#2a1a1a",
                border: "1px solid #5a2a2a",
                borderRadius: 10,
                fontSize: "0.83rem",
                color: "#e8a0a0",
                marginBottom: "1rem",
              }}
            >
              {error}
              <button
                onClick={() => {
                  setError(null);
                  setMessages((m) => m.slice(0, -1));
                }}
                style={{
                  display: "block",
                  marginTop: 6,
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                ← Remove last message and retry
              </button>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* INPUT BAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, var(--bg) 30%)",
          padding: "2rem 1rem 1rem",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {!loading && phase < 5 && messages.length > 2 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "0.6rem",
              }}
            >
              <button
                onClick={advancePhase}
                style={{
                  padding: "0.4rem 1rem",
                  background: "transparent",
                  border: "1px solid var(--accent-dim)",
                  borderRadius: 20,
                  color: "var(--accent)",
                  fontSize: "0.73rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--accent)";
                  e.target.style.color = "var(--bg)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "var(--accent)";
                }}
              >
                Advance to Phase {phase + 1}: {PHASES[phase]?.label} →
              </button>
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: 8,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "0.5rem 0.5rem 0.5rem 1rem",
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Share your thoughts..."
              disabled={loading}
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                background: "transparent",
                border: "none",
                color: "var(--fg)",
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                lineHeight: 1.5,
                maxHeight: 120,
                overflowY: "auto",
                padding: "0.4rem 0",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                flexShrink: 0,
                background:
                  input.trim() && !loading
                    ? "var(--accent)"
                    : "var(--surface-alt)",
                border: "none",
                color:
                  input.trim() && !loading ? "var(--bg)" : "var(--fg-dim)",
                fontSize: "1.1rem",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              ↑
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "0.45rem",
              fontSize: "0.62rem",
              color: "var(--fg-dim)",
              letterSpacing: "0.04em",
            }}
          >
            Namewright · Phase {phase}/5 · {provider.name}
          </div>
        </div>
      </div>
    </div>
  );
}
