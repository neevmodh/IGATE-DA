"use client";

import { useState } from "react";

export default function Calculator({ onClose }: { onClose: () => void }) {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string>("");

  function press(v: string) {
    setExpr((e) => e + v);
  }

  function clear() {
    setExpr("");
    setResult("");
  }

  function backspace() {
    setExpr((e) => e.slice(0, -1));
  }

  function evaluate() {
    try {
      const safe = expr
        .replace(/\^/g, "**")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(");
      if (!/^[0-9+\-*/().\sA-Za-z\d]*$/.test(safe)) throw new Error("invalid");
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict"; return (${safe})`)();
      setResult(String(val));
    } catch {
      setResult("Error");
    }
  }

  const buttons = [
    "7", "8", "9", "/", "sqrt(",
    "4", "5", "6", "*", "^",
    "1", "2", "3", "-", "log(",
    "0", ".", "(", ")", "+",
    "sin(", "cos(", "tan(", "ln(", "=",
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-lg border border-border bg-surface shadow-xl p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Calculator</span>
        <button onClick={onClose} className="text-xs text-ink-3 hover:text-ink">
          ✕
        </button>
      </div>
      <div className="rounded-md border border-border mb-2 p-2 text-right">
        <div className="text-xs text-ink-3 h-4 overflow-hidden">{expr || "0"}</div>
        <div className="text-lg font-mono">{result}</div>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {buttons.map((b) => (
          <button
            key={b}
            onClick={() => (b === "=" ? evaluate() : press(b))}
            className="rounded bg-border-soft text-xs py-1.5 hover:bg-border"
          >
            {b}
          </button>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        <button onClick={backspace} className="flex-1 rounded bg-border-soft text-xs py-1.5">
          ⌫
        </button>
        <button onClick={clear} className="flex-1 rounded bg-border-soft text-xs py-1.5">
          Clear
        </button>
      </div>
    </div>
  );
}
