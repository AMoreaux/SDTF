export function pickRandomInList<T extends readonly any[] | any[]>(items: T): T[number] {
  return items[Math.floor(Math.random() * (items.length - 1))];
}

export function pickRandomNumberInRange(min: number, max: number, step: number = 1): number {
  if (step <= 0) {
    throw new Error('Step must be greater than 0');
  }
  var decimal = step - Math.floor(step);
  const precision = decimal > 0 ? decimal.toString().split('.')[1].length : 0;
  const value = Math.random() * (max - min) + min;
  return Number((Math.round(value / step) * step).toFixed(precision));
}

export function makeRandomString(length: number = 12): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
