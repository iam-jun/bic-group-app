export interface IShowAlert {
  title?: string;
  content: string;
  onConfirm?: () => void;
  cancelBtn?: boolean;
  onCancel?: () => void;
}
