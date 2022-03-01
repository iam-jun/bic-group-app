import {ICreatePostParams} from '~/interfaces/IPost';

export interface ISelectAudienceParams extends ICreatePostParams {
  isFirstStep?: boolean;
}
