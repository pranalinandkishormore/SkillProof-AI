import { useState, useEffect } from "react";

const questions = [
  { q: "Which hook manages state in React?", options: ["useEffect", "useState", "useRef", "useMemo"], answer: 1 },
  { q: "Which HTTP method creates a resource?", options: ["GET", "PUT", "POST", "DELETE"], answer: 2 },
  { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Coded Style Sheets"], answer: 0 },
];

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [warnings, setWarnings] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => setSubmitted(true);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden && !submitted) {
        setWarnings((w) => w + 1);
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [submitted]);

  useEffect(() => {
    if (warnings >= 2 && !submitted) submit();
  }, [warnings, submitted]);

  const block = (e) => e.preventDefault();

  if (submitted) {
    const score = questions.filter((x, i) => answers[i] === x.answer).length;
    return <h2>Submitted. Score: {score}/{questions.length}</h2>;
  }

  return (
    <div onCopy={block} onPaste={block} onCut={block} onContextMenu={block} style={{ userSelect: "none" }}>
      <p>Warnings: {warnings}/2 (switching tabs twice auto-submits)</p>
      {questions.map((item, i) => (
        <div key={i}>
          <h3>{item.q}</h3>
          {item.options.map((opt, j) => (
            <label key={j} style={{ display: "block" }}>
              <input type="radio" name={`q${i}`} onChange={() => setAnswers({ ...answers, [i]: j })} /> {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submit}>Submit</button>
    </div>
  );
}