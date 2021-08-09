export const generateAvatar = (name?: string, color?: string) => {
  return `https://ui-avatars.com/api/?name=${
    name?.toUpperCase() || ''
  }&background=${color || '4c95ff'}&color=fff&size=128`;
};

export function timeOut(ms?: number) {
  return new Promise(resolve => setTimeout(resolve, ms || 100));
}

export function titleCase(str) {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}
