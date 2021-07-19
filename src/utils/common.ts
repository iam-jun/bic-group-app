export const generateAvatar = (name?: string, color?: string) => {
  return `https://ui-avatars.com/api/?name=${
    name?.toUpperCase() || ''
  }&background=${color || '4c95ff'}&color=fff&size=128`;
};

export function timeOut(ms?: number) {
  return new Promise(resolve => setTimeout(resolve, ms || 100));
}
