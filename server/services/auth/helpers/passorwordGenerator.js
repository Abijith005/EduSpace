const generatePassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "@#$%&*";

  const pickRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

  const part1 =
    pickRandom(special) + pickRandom(uppercase) + pickRandom(lowercase);
  const part2 = pickRandom(digits) + pickRandom(digits);
  const part3 =
    pickRandom(special) + pickRandom(digits) + pickRandom(lowercase);
  const part4 =
    pickRandom(uppercase) + pickRandom(lowercase) + pickRandom(digits);

  const password = part1 + part2 + part3 + part4;

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export default generatePassword;
