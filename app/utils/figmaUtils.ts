export const convertNameToClass = (name: string) => {
  return name.toLowerCase().replaceAll(" ", "-");
};

export const generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
};
