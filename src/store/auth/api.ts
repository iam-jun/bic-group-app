import {axios} from '~/utils/api';
import {ISignIn} from './interfaces';
import {POST, GET} from '~/constants/api';

/**
 * Sign In
 * @returns {*}
 */

export const signIn = async (payload: ISignIn) => {
  return await axios(POST, '/login', payload);
};
