function generateCharacters(length) {
  const charset = Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33)).join('');
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
}

export default generateCharacters;