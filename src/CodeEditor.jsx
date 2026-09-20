import { useState } from "react";
import Editor from "@monaco-editor/react";

const starter = `function sum(a, b) {
  // write your code here
}`;

const tests = [
  { args: [2, 3], expected: 5 },
  { args: [10, -4], expected: 6 },
  { args: [0, 0], expected: 0 },
];

export default function CodeEditor() {
  const [code, setCode] = useState(starter);
  const [results, setResults] = useState([]);

  const runTests = () => {
    try {
      const fn = new Function(code + "; return sum;")();
      const out = tests.map((t) => {
        const actual = fn(...t.args);
        return { ...t, actual, pass: actual === t.expected };
      });
      setResults(out);
    } catch (err) {
      setResults([{ error: err.message }]);
    }
  };

  const block = (e) => e.preventDefault();

  return (
    <div
      onPasteCapture={block}
      onCopyCapture={block}
      onCutCapture={block}
      onContextMenu={block}
    >
      <h3>Coding Task: write a function sum(a, b) that returns a + b</h3>
      <Editor
        height="250px"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(v) => setCode(v || "")}
      />
      <button onClick={runTests}>Run Tests</button>

      {results.map((r, i) =>
        r.error ? (
          <p key={i} style={{ color: "red" }}>Error: {r.error}</p>
        ) : (
          <p key={i} style={{ color: r.pass ? "green" : "red" }}>
            sum({r.args.join(", ")}) → {String(r.actual)} (expected {r.expected}) {r.pass ? "✅" : "❌"}
          </p>
        )
      )}
      <p>
        Passed: {results.filter((r) => r.pass).length}/{tests.length}
      </p>
    </div>
  );
}