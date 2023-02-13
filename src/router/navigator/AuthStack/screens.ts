import SignIn from '~/screens/auth/SignIn';
import ForgotPassword from '~/screens/auth/ForgotPassword';
import ConfirmUser from '~/screens/auth/VerifyEmail/ConfirmUser';

const authScreens = {
  'sign-in': SignIn,
  'forgot-password': ForgotPassword,
  'confirm-user': ConfirmUser,
};

export default authScreens;
