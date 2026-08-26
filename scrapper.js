(async () => {
  const item = document.querySelector('.lt-full-transcript__item');
  if (!item) return console.error("Target element not found. Ensure the transcript panel is open and visible.");

  let scrollEl = item.parentElement;
  while (scrollEl && scrollEl.scrollHeight <= scrollEl.clientHeight && scrollEl !== document.body) {
    scrollEl = scrollEl.parentElement;
  }

  const collected = new Map();
  console.log("Scrolling and extracting transcript data...");

  scrollEl.scrollTop = 0;
  await new Promise(r => setTimeout(r, 400));

  let lastTop = -1;
  while (scrollEl.scrollTop !== lastTop) {
    lastTop = scrollEl.scrollTop;
    
    document.querySelectorAll('.lt-full-transcript__item').forEach(el => {
      const text = el.innerText.trim();
      if (text) {
        const key = el.style.top || text;
        collected.set(key, text);
      }
    });

    scrollEl.scrollTop += scrollEl.clientHeight * 0.8;
    await new Promise(r => setTimeout(r, 150));
  }

  document.querySelectorAll('.lt-full-transcript__item').forEach(el => {
    const text = el.innerText.trim();
    if (text) collected.set(el.style.top || text, text);
  });

  const result = Array.from(collected.values()).join('\n\n---\n\n');

  const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Zoom_Transcript_Export.txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log(`Extraction complete. File downloaded successfully (${collected.size} blocks extracted).`);
})();
