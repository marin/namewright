import { useState } from "react";
import { PROVIDERS } from "./providers";

const labelStyle = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--accent)",
  marginBottom: "0.5rem",
  fontWeight: 600,
};

export default function SettingsScreen({ config, setConfig, onDone }) {
  const provider = PROVIDERS[config.providerId];
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="ne-fade-up">
      <div
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--accent)",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          marginBottom: "0.8rem",
        }}
      >
        ⚙ Configuration
      </div>

      <label style={labelStyle}>Provider</label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: "1.2rem",
        }}
      >
        {Object.entries(PROVIDERS).map(([id, p]) => (
          <button
            key={id}
            onClick={() =>
              setConfig((c) => ({
                ...c,
                providerId: id,
                model: p.defaultModel,
                apiKey: "",
              }))
            }
            style={{
              padding: "0.7rem 0.8rem",
              background:
                config.providerId === id ? "var(--accent)" : "var(--surface)",
              color: config.providerId === id ? "var(--bg)" : "var(--fg)",
              border:
                config.providerId === id
                  ? "none"
                  : "1px solid var(--border)",
              borderRadius: 8,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
              fontFamily: "var(--font-body)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.name}</div>
            <div style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: 2 }}>
              {p.note}
            </div>
          </button>
        ))}
      </div>

      <label style={labelStyle}>Model</label>
      <select
        value={config.model}
        onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
        style={{
          width: "100%",
          padding: "0.7rem 0.8rem",
          marginBottom: "1.2rem",
          background: "var(--surface)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          fontSize: "0.88rem",
          cursor: "pointer",
        }}
      >
        {provider.models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <label style={labelStyle}>
        API Key
        <a
          href={provider.signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: 8,
            color: "var(--accent)",
            fontSize: "0.7rem",
            textDecoration: "none",
            fontWeight: 400,
          }}
        >
          Get free key →
        </a>
      </label>
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <input
          type={showKey ? "text" : "password"}
          value={config.apiKey}
          onChange={(e) => setConfig((c) => ({ ...c, apiKey: e.target.value }))}
          placeholder={`Paste your ${provider.name} API key`}
          style={{
            width: "100%",
            padding: "0.7rem 3rem 0.7rem 0.8rem",
            background: "var(--surface)",
            color: "var(--fg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontFamily: "monospace",
            fontSize: "0.85rem",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <button
          onClick={() => setShowKey(!showKey)}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "var(--fg-dim)",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontFamily: "var(--font-body)",
          }}
        >
          {showKey ? "Hide" : "Show"}
        </button>
      </div>

      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--fg-dim)",
          marginBottom: "1.5rem",
          lineHeight: 1.55,
          padding: "0.7rem",
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border)",
        }}
      >
        Your API key stays in your browser's memory only. It's sent directly to{" "}
        {provider.name} and never stored or logged.
      </div>

      <button
        onClick={onDone}
        disabled={!config.apiKey.trim()}
        style={{
          width: "100%",
          padding: "0.85rem",
          background: config.apiKey.trim()
            ? "var(--accent)"
            : "var(--surface-alt)",
          color: config.apiKey.trim() ? "var(--bg)" : "var(--fg-dim)",
          border: "none",
          borderRadius: 8,
          fontFamily: "var(--font-display)",
          fontSize: "1.05rem",
          fontStyle: "italic",
          cursor: config.apiKey.trim() ? "pointer" : "default",
          transition: "all 0.25s",
        }}
      >
        Begin the naming process →
      </button>
    </div>
  );
}
