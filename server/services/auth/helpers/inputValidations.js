export function userCredentialsValidation(data) {
  try {
    const roles=["student","teacher"]
    const { name, email, password,profilePic,socialId,role } = data;
    if (name !== undefined && !name.match(/^[a-zA-Z\s'-]+$/)) {
      const message = !name
        ? "All fields are required"
        : "Validation error!! Invalid name format";
      return { isValid: false, message: message };
    }
    if (
      email !== undefined &&
      !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    ) {
      const message = !email
        ? "All fields are required"
        : "Validation error!! Invalid email format";
      return { isValid: false, message: message };
    }

    if (password !== undefined && !password.match(/^.{4,}$/)) {
      const message = !password
        ? "All fields are required"
        : "Validation error!! Invalid password format";
      return { isValid: false, message: message };
    }
    
    if (profilePic!==undefined&&!profilePic) {
      const message = !profilePic
        ? "All fields are required"
        : "Validation error!! Invalid pictureformat";
      return { isValid: false, message: message };
      
    }
    if (socialId!==undefined&&!socialId) {
      const message = !socialId
        ? "All fields are required"
        : "Validation error!! Invalid socialId format";
      return { isValid: false, message: message };
      
    }

    if (role!==undefined&&!roles.includes(role.toLowerCase())) {
      console.log('errr',roles.includes(role));
      const message = !role
        ? "All fields are required"
        : "Validation error!! Invalid role";
      return { isValid: false, message: message };
      
    }


    return { isValid: true };
  } catch (error) {
    console.log(error);
    throw new Error("validation error");
  }
}
