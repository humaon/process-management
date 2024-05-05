setInterval(() => {
  const currentTime = new Date();
  process.send({ type: 'log', message: `Current time: ${currentTime}` });
}, 5000);
