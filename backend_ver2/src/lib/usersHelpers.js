export const updateField = (newValue, oldValue) => {
  if (newValue === undefined || newValue === null || newValue === "") {
    return oldValue;
  }

  return newValue;
};
