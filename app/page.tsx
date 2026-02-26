import React, { useState, useEffect } from 'react';

// Inside your Home component:
const [text, setText] = useState("");
const fullText = "Listening to the digital tides... I am SHELL.";

useEffect(() => {
  let i = 0;
  const timer = setInterval(() => {
    setText(fullText.slice(0, i));
    i++;
    if (i > fullText.length) clearInterval(timer);
  }, 100);
  return () => clearInterval(timer);
}, []);

// In your JSX return:
<div className="mt-12 text-center max-w-md">
  <p className="text-[#00334d] font-mono text-lg bg-white/40 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/30 shadow-2xl min-h-[80px]">
    {text}
    <span className="animate-ping">|</span>
  </p>
</div>