export const setItemStorage = ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItemStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const removeItemStorage = (key: string) => {
  localStorage.removeItem(key);
};
