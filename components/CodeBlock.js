"use client";
import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';

import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import sql from 'highlight.js/lib/languages/sql';

// Neobrutalism için koyu tema
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('sql', sql);

export default function CodeBlock({ code, language }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langMap = {
    javascript: 'javascript',
    python: 'python',
    cpp: 'cpp',
    sql: 'sql',
  };

  return (
    <div className="border-3 border-neo-black overflow-hidden shadow-neo my-6 bg-[#282c34]">
      {/* Üst bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e2227] border-b-3 border-neo-black">
        <div className="flex items-center gap-2">
          {/* Mac tarzı noktalar */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-neo-red border border-neo-black"></span>
            <span className="w-3 h-3 rounded-full bg-neo-yellow border border-neo-black"></span>
            <span className="w-3 h-3 rounded-full bg-neo-green border border-neo-black"></span>
          </div>
          <span className="ml-2 text-gray-400 font-mono text-sm">solution.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'sql'}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`font-mono text-sm px-3 py-1 border-2 border-neo-black transition-all duration-200 cursor-pointer active:translate-y-[2px] ${
            copied ? 'bg-neo-green text-neo-black' : 'bg-neo-white text-neo-black hover:bg-neo-yellow'
          }`}
        >
          {copied ? '✓ KOPYALANDI' : '📋 KOPYALA'}
        </button>
      </div>
      {/* Kod alanı */}
      <pre className="p-6 overflow-x-auto m-0">
        <code ref={codeRef} className={`language-${langMap[language] || language} font-mono text-sm leading-relaxed block`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
