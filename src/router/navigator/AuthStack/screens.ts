import SignIn from '~/screens/auth/SignIn';
import ForgotPassword from '~/screens/auth/ForgotPassword';
import ConfirmUser from '~/screens/auth/VerifyEmail/ConfirmUser';
import SignUp from '~/screens/auth/SignUp';

const authScreens = {
  'sign-in': SignIn,
  'sign-up': SignUp,
  'forgot-password': ForgotPassword,
  'confirm-user': ConfirmUser,
};

export default authScreens;
