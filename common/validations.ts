export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

export const isValidName = (name: string): boolean => {
  const nameRegex =/^[A-Za-zÁÉÍÓÚáéíóúÜüñÑ' ]{2,50}$/;
  return nameRegex.test(name);
};