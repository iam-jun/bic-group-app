import SignIn from '~/screens/Auth/SignIn';
import SignUp from '~/screens/Auth/SignUp';
import ForgotPassword from '~/screens/Auth/ForgotPassword';
import Landing from '~/screens/Auth/Landing';

const authScreens = {
  landing: Landing,
  'sign-in': SignIn,
  'sign-up': SignUp,
  'forgot-password': ForgotPassword,
}

export default authScreens
