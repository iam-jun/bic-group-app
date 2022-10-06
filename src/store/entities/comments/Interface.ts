import {
  ICommentData, IAllComments, IPayloadUpdateCommentsById,
} from '~/interfaces/IPost';
import { IPayloadUpdateCreatedComment } from './actions/updateCreatedComment';
import IBaseState from '~/store/interfaces/IBaseState';

interface ICommentsState extends IBaseState{
  comments: {[id: string]: ICommentData}
  commentsByParentId: {[id: string]: ICommentData[]}

  actions?: {
    setComments?: (payload?: IAllComments) => void;
    setCommentsByParentId?: (payload?: {[id: string]: ICommentData[]}) => void;

    addToComments?: (payload: ICommentData[] | ICommentData) => void;
    addToCommentsByParentId?: (payload: {[x: string]: ICommentData[]}) => void;
    addToCommentsByParentIdWithComments?: (payload: IPayloadUpdateCommentsById) => void;
    updateCreatedComment?: (payload: IPayloadUpdateCreatedComment) => void;
    cancelCommentFailed?: (payload: ICommentData) => void;
  }

  reset?: () => void;
}

export default ICommentsState;
