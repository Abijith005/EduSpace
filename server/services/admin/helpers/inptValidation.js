import validator from 'validator';

function isValidWhitelist(str) {
  const whitelistPattern = /^[a-zA-Z0-9\s-_.]+$/;
  return whitelistPattern.test(str.trim());
}

function isEmpty(str) {
  return validator.isEmpty(str.trim());
}

export function inputValidation(data) {
    try {
      const { title, icon } = data;
  
      const validationRules = [
        {
          condition: title !== undefined && (typeof title !== 'string' || isEmpty(title)),
          message: "Validation error!! Invalid title format"
        },
        {
          condition: icon !== undefined && (typeof icon !== 'string' || isEmpty(icon)),
          message: "Validation error!! Invalid icon format"
        },
        {
          condition: title !== undefined && !isValidWhitelist(title),
          message: "Validation error!! Title contains invalid characters"
        },
        {
          condition: icon !== undefined && !isValidWhitelist(icon),
          message: "Validation error!! Icon contains invalid characters"
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
  