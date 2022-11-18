export const isIndexEqualValue = (arr: number[]) => {
  let isEqual = true;
  for (let i = 0; i < arr.length - 1; ++i) {
    if (i !== arr[i]) {
      isEqual = false;
      break;
    }
  }
  return isEqual;
};
