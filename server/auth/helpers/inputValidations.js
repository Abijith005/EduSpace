export function userCredentialsValidation(data) {
  try {
    const { name, email, password } = data;
    if (name && !name?.match(/^[a-zA-Z\s'-]+$/)) {
      return false;
    }
    if (
      !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/) ||
      !password.match(/^.{4,}$/)
    ) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    throw new Error("validation error");
  }
}
