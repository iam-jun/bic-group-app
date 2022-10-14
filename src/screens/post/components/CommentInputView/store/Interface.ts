import { IPayloadCreateComment, IReaction } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';

interface ICommentInputState extends IBaseState{
  createComment: {
    loading: boolean,
    content: string,
    image: any,
  }

  actions?: {
    setCreateComment?: (payload: {
    loading?: boolean;
    content?: string;
    image?: any;
  })=>void;
    createComment?: (payload: IPayloadCreateComment) => void;
    retryAddComment?: (payload: IReaction) => void;
  }

  reset?: () => void;
}

export default ICommentInputState;
