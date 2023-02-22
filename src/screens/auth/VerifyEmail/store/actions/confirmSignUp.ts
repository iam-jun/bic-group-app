import { Auth } from 'aws-amplify';
import { IVerifyEmailState } from '..';

const confirmSignUp = (_set, get) => async (
  username: string, code: string,
) => {
  const state: IVerifyEmailState = get();
  const { actions } = state || {};
  try {
    actions.setLinkIsExpired(false);
    actions.setLoadingConfirmSignUp(true);
    await Auth.confirmSignUp(username, code);
    actions.setLoadingConfirmSignUp(false);
  } catch (error) {
    console.error('\x1b[35m🐣️ confirmSignUp  ', error, '\x1b[0m');
    actions.setLinkIsExpired(true);
    actions.setLoadingConfirmSignUp(false);
  }
};

export default confirmSignUp;
