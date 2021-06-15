import baseAPI from '~/utils/baseAPI';
import {ISignIn} from './interfaces';

/**
 * Sign In
 * @returns {*}
 */

export const signIn = (payload: ISignIn) => {
  return baseAPI.post('login', payload);
};
