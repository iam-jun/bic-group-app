// Community: level is undefined or level = 0
// Group: level > 0
export const isGroup = (item: any) => !!item?.level && !item?.isCommunity;
