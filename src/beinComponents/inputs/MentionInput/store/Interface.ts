import { IMentionUser } from '~/interfaces/IPost';

export interface ICursorPositionChange {
  position: number;
  value: string;
  groupIds: string;
}

export interface ICompleteMention {
  item: IMentionUser;
  text: string;
  cursorPosition: number;
}

interface IMentionInputState {
  fullContent: string;
  key: string;
  topPosition: number;
  loading: boolean;
  data: any[];
  tempSelected: any;
  canLoadMore?: boolean;
  error?: any;

  setText: (payload: string) => void;
  setFullContent: (payload: string) => void;
  setData: (payload: any[]) => void;
  addTempSelected: (payload: {[x: string]: any}) => void;
  doCompleteMention: (payload: ICompleteMention) => void;
  doRunSearch: (groupIds: string, payload: string, ignoreMatchTerm?: boolean) => void;
  reset?: () => void;

}

export default IMentionInputState;
