import SignIn from '~/screens/auth/SignIn';
import SignUp from '~/screens/auth/SignUp';
import ForgotPassword from '~/screens/auth/ForgotPassword';
import Landing from '~/screens/auth/Landing';

const authScreens = {
  landing: Landing,
  'sign-in': SignIn,
  'sign-up': SignUp,
  'forgot-password': ForgotPassword,
}

export default authScreens
