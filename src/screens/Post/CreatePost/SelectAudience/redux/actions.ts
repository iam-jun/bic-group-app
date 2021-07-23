import {IUser} from '~/interfaces/IAuth';
import audienceTypes from './constants';

const audienceActions = {
  getAudiences: {
    type: audienceTypes.GET_AUDIENCES,
  },
  setAudiences: (payload: {user: IUser}[]) => ({
    type: audienceTypes.SET_AUDIENCES,
    payload,
  }),
};

export default audienceActions;
