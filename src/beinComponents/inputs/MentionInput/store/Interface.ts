import { IMentionUser, IParamSearchMentionAudiences } from '~/interfaces/IPost';

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
  text: string;
  fullContent: string;
  key: string;
  cursorPosition: number;
  topPosition: number;
  loading: boolean;
  data: [];
  tempSelected: any;

  setText: (payload: string) => void;
  setFullContent: (payload: string) => void;
  setData: (payload: any[]) => void;
  setCursorPosition: (payload: number) => void;
  addTempSelected: (payload: {[x: string]: any}) => void;
  doCompleteMention: (payload: ICompleteMention) => void;
  doRunSearch: (payload: IParamSearchMentionAudiences) => void;
  reset?: () => void;

}

export default IMentionInputState;
