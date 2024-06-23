import { randomBytes } from "crypto";

async function generateOtp() {
  try {
    const min = 1000;
    const max = 9999;
    const range = max - min + 1;
    const randomBytesBuffer = randomBytes(4);
    const randomInt = Math.floor(
      (randomBytesBuffer.readUInt32BE(0) / 0xffffffff) * range + min
    );
    console.log(randomInt, "otp");
    return randomInt;
  } catch (error) {
    console.log("Err", error);
  }
}

export default generateOtp;
