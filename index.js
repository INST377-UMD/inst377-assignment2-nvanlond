fetch('https://zenquotes.io/api/random')
  .then(res => res.json())
  .then(data => {
    const quoteText = `${data[0].q} — ${data[0].a}`;
    document.getElementById('quote').textContent = quoteText;
  });

if (annyang) {
  const commands = setupVoiceCommands(); 
  annyang.addCommands(commands);
}
