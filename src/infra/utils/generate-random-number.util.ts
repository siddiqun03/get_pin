function generateRandomNumber(length) {
  if (length <= 0) return 'Length must be greater than 0';

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default generateRandomNumber;