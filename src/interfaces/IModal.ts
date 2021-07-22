export interface IShowAlert {
  title?: string;
  content: string;
  iconName?: string;
  onConfirm?: () => void;
  cancelBtn?: boolean;
  onCancel?: () => void;
}
