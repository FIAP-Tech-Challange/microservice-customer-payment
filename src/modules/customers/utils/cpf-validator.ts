export function validateCPF(cpf: string): boolean {
  const cleanCpf = cpf.replace(/\D/g, '');

  if (cleanCpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1+$/.test(cleanCpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }

  let rest = sum % 11;
  const digit1 = rest < 2 ? 0 : 11 - rest;

  if (parseInt(cleanCpf.charAt(9)) !== digit1) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }

  rest = sum % 11;
  const digit2 = rest < 2 ? 0 : 11 - rest;

  return parseInt(cleanCpf.charAt(10)) === digit2;
}
