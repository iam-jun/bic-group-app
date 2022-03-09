//Check permission only on mobile app
export const checkPermission = async (
  type: string,
  dispatch: any,
  callback: (canOpenPicker: boolean) => void,
) => {
  callback?.(true);
};
