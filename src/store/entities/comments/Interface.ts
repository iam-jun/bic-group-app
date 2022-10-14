import {
  ICommentData, IAllComments, IPayloadUpdateCommentsById, IAddChildCommentToComment,
} from '~/interfaces/IPost';
import { IPayloadUpdateCreatedComment } from './actions/updateCreatedComment';
import IBaseState from '~/store/interfaces/IBaseState';

interface ICommentsState extends IBaseState{
  comments: {[id: string]: ICommentData}
  commentsByParentId: {[id: string]: string[]}

  actions?: {
    setComments?: (payload?: IAllComments) => void;
    setCommentsByParentId?: (payload?: {[id: string]: string[]}) => void;

    addToComments?: (payload: ICommentData[] | ICommentData) => void;
    addToCommentsByParentId?: (payload: {[x: string]: string[]}) => void;
    addToCommentsByParentIdWithComments?: (payload: IPayloadUpdateCommentsById) => void;
    updateCreatedComment?: (payload: IPayloadUpdateCreatedComment) => void;
    cancelCommentFailed?: (payload: ICommentData) => void;
    addChildCommentToComment?: (payload: IAddChildCommentToComment)=>void;
  }

  reset?: () => void;
}

export default ICommentsState;
