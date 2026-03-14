import React from "react";

function renderInline(text) {
  const parts = [];
  let rem = text;
  let k = 0;
  while (rem.length > 0) {
    const bm = rem.match(/\*\*(.+?)\*\*/);
    const im = rem.match(/(?<!\*)\*([^*]+?)\*(?!\*)/);
    const cm = rem.match(/`([^`]+?)`/);
    let earliest = null,
      type = null;
    [
      [bm, "b"],
      [im, "i"],
      [cm, "c"],
    ].forEach(([m, t]) => {
      if (m && (!earliest || m.index < earliest.index)) {
        earliest = m;
        type = t;
      }
    });
    if (!earliest) {
      parts.push(<span key={k++}>{rem}</span>);
      break;
    }
    if (earliest.index > 0)
      parts.push(<span key={k++}>{rem.slice(0, earliest.index)}</span>);
    if (type === "b")
      parts.push(
        <strong key={k++} style={{ fontWeight: 700, color: "var(--fg)" }}>
          {earliest[1]}
        </strong>
      );
    else if (type === "i") parts.push(<em key={k++}>{earliest[1]}</em>);
    else
      parts.push(
        <code
          key={k++}
          style={{
            background: "var(--surface-alt)",
            padding: "0.1em 0.35em",
            borderRadius: 4,
            fontSize: "0.87em",
            fontFamily: "monospace",
          }}
        >
          {earliest[1]}
        </code>
      );
    rem = rem.slice(earliest.index + earliest[0].length);
  }
  return parts;
}

const styles = {
  h1: {
    fontSize: "1.3rem",
    fontWeight: 800,
    margin: "1.5em 0 0.5em",
    color: "var(--fg)",
    fontFamily: "var(--font-display)",
  },
  h2: {
    fontSize: "1.15rem",
    fontWeight: 700,
    margin: "1.4em 0 0.5em",
    color: "var(--fg)",
    fontFamily: "var(--font-display)",
  },
  h3: {
    fontSize: "1rem",
    fontWeight: 700,
    margin: "1.2em 0 0.4em",
    color: "var(--accent)",
    fontFamily: "var(--font-display)",
  },
  th: {
    padding: "0.55em 0.7em",
    borderBottom: "2px solid var(--accent)",
    textAlign: "left",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    color: "var(--accent)",
    fontSize: "0.82rem",
  },
  td: {
    padding: "0.45em 0.7em",
    borderBottom: "1px solid var(--border)",
  },
};

export default function MarkdownRenderer({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} style={styles.h3}>
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} style={styles.h2}>
          {renderInline(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} style={styles.h1}>
          {renderInline(line.slice(2))}
        </h1>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        items.push(
          <li key={i} style={{ marginBottom: "0.3em", paddingLeft: "0.2em" }}>
            {renderInline(lines[i].slice(2))}
          </li>
        );
        i++;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          style={{
            margin: "0.5em 0",
            paddingLeft: "1.4em",
            listStyleType: "disc",
          }}
        >
          {items}
        </ul>
      );
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={i} style={{ marginBottom: "0.3em" }}>
            {renderInline(lines[i].replace(/^\d+\.\s/, ""))}
          </li>
        );
        i++;
      }
      elements.push(
        <ol
          key={`ol-${i}`}
          style={{ margin: "0.5em 0", paddingLeft: "1.4em" }}
        >
          {items}
        </ol>
      );
      continue;
    } else if (line.startsWith("---")) {
      elements.push(
        <hr
          key={i}
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            margin: "1.5em 0",
          }}
        />
      );
    } else if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i].split("|").filter((c) => c.trim() !== "");
        if (!lines[i].match(/^\|[\s-:|]+$/))
          rows.push(cells.map((c) => c.trim()));
        i++;
      }
      if (rows.length > 0) {
        const [header, ...body] = rows;
        elements.push(
          <div
            key={`tbl-${i}`}
            style={{
              overflowX: "auto",
              margin: "1em 0",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.82rem",
              }}
            >
              <thead>
                <tr>
                  {header.map((h, j) => (
                    <th key={j} style={styles.th}>
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr
                    key={ri}
                    style={{
                      background:
                        ri % 2 === 0
                          ? "transparent"
                          : "rgba(255,255,255,0.02)",
                    }}
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} style={styles.td}>
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "0.5em" }} />);
    } else {
      elements.push(
        <p key={i} style={{ margin: "0.4em 0", lineHeight: 1.65 }}>
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }
  return <>{elements}</>;
}
