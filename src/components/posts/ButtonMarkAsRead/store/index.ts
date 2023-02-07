import { IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import putMarkAsRead from './actions/putMarkAsRead';

export interface IButtonMarkAsReadState extends IBaseState {
  actions: {
    putMarkAsRead: (payload: IPayloadPutMarkAsRead) => void;
  };
}

const buttonMarkAsReadStore = () => ({
  actions: {
    putMarkAsRead: putMarkAsRead(),
  },
});

const useButtonMarkAsReadStore = createStore<IButtonMarkAsReadState>(buttonMarkAsReadStore);

export default useButtonMarkAsReadStore;
