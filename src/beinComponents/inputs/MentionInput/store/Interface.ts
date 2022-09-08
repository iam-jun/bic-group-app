import { IMentionUser } from '~/interfaces/IPost';

export interface ICursorPositionChange {
  position: number;
  value: string;
}

export interface ICompleteMention {
  item: IMentionUser;
  text: string;
  cursorPosition: number;
}

interface IMentionInputState {
  text: string;
  fullContent: string;
  key: string;
  groupIds: string,
  cursorPosition: number;
  topPosition: number;
  loading: boolean;
  data: any[];
  tempSelected: any;
  canLoadMore?: boolean;
  error?: any;

  setText: (payload: string) => void;
  setGroupIds: (payload: string) => void;
  setFullContent: (payload: string) => void;
  setData: (payload: any[]) => void;
  setCursorPosition: (payload: number) => void;
  addTempSelected: (payload: {[x: string]: any}) => void;
  doCompleteMention: (payload: ICompleteMention) => void;
  doRunSearch: (payload: string) => void;
  reset?: () => void;

}

export default IMentionInputState;
