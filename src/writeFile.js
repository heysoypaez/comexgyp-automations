fs.writeFile("./questions.log", questionsText, (err, data) => {
  if (err) {
    return console.log(err);
  }
});