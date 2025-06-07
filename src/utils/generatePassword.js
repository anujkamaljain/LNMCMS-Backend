function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber() {
  return getRndInteger(0, 10).toString(); // 0–9
}

function generateRndLowercase() {
  return String.fromCharCode(getRndInteger(97, 123)); // a–z
}

function generateRndUppercase() {
  return String.fromCharCode(getRndInteger(65, 91)); // A–Z
}

function generateRndSymbol() {
  const symbols = '@#$&';
  return symbols.charAt(getRndInteger(0, symbols.length));
}

function shufflePassword(passwordArray) {
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  return passwordArray.join('');
}

function generatePassword(length = 12) {
  const generators = [
    generateRndUppercase,
    generateRndLowercase,
    generateRndNumber,
    generateRndSymbol,
  ];

  const passwordArray = [];

  // Ensure one of each type
  generators.forEach(fn => passwordArray.push(fn()));

  // Fill the rest
  for (let i = generators.length; i < length; i++) {
    const randFunc = generators[getRndInteger(0, generators.length)];
    passwordArray.push(randFunc());
  }

  return shufflePassword(passwordArray);
}

module.exports = generatePassword;
