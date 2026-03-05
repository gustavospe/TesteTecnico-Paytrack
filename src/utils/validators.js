/**
 * Valida se o usuário tem 18 anos ou mais
 * @param {Object} dob - Data de nascimento do usuário
 * @param {number} dob.age - Idade do usuário
 * @returns {boolean} True se o usuário é maior de idade
 */
function isAdult(dob) {
  return dob && dob.age >= 18;
}

/**
 * Valida se o email é válido
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se o email é válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida um objeto de usuário
 * @param {Object} user - Usuário a ser validado
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateUser(user) {
  const errors = [];

  if (!user.email || !isValidEmail(user.email)) {
    errors.push('Email inválido ou ausente');
  }

  if (!user.dob || !isAdult(user.dob)) {
    errors.push('Usuário menor de 18 anos');
  }

  if (!user.name || !user.name.first || !user.name.last) {
    errors.push('Nome incompleto');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  isAdult,
  isValidEmail,
  validateUser,
};
