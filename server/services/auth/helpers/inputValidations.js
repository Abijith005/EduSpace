const roles = ["student", "teacher"];

export function userCredentialsValidation(data) {
  try {
    const { name, email, password, profilePic, socialId, role } = data;
    
    const validationRules = [
      {
        condition: name !== undefined && !name.match(/^[a-zA-Z\s'-]+$/),
        message: "Validation error!! Invalid name format"
      },
      {
        condition: email !== undefined && !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
        message: "Validation error!! Invalid email format"
      },
      {
        condition: password !== undefined && !password.match(/^.{4,}$/),
        message: "Validation error!! Invalid password format"
      },
      {
        condition: profilePic !== undefined && !profilePic,
        message: "Validation error!! Invalid picture format"
      },
      {
        condition: socialId !== undefined && !socialId,
        message: "Validation error!! Invalid socialId format"
      },
      {
        condition: role !== undefined && !roles.includes(role.toLowerCase()),
        message: "Validation error!! Invalid role"
      }
    ];

    for (const rule of validationRules) {
      if (rule.condition) {
        return { isValid: false, message: rule.message };
      }
    }

    return { isValid: true };
  } catch (error) {
    console.error(error);
    throw new Error("Validation error");
  }
}
