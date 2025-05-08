function setupVoiceCommands() {
    return {
      'hello': () => alert('Hello World!'),
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'navigate to *page': (page) => {
        const lower = page.toLowerCase();
        if (lower.includes("home")) location.href = "index.html";
        if (lower.includes("stock")) location.href = "stocks.html";
        if (lower.includes("dog")) location.href = "dogs.html";
      }
    };
  }