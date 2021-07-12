import {useEffect} from 'react';
import {Auth, Hub} from "aws-amplify";
import {useDispatch} from "react-redux";
import {HubCapsule} from "@aws-amplify/core/src/Hub";

import * as actions from '~/screens/Auth/redux/actions';

const useAuthAmplifyHub = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleAuthEvent = ({payload: {event, data}}: HubCapsule) => {
            switch (event) {
                case "signIn":
                    Auth.currentAuthenticatedUser()
                        .then(userResponse => {
                            dispatch(actions.signInSuccess(userResponse));
                        })
                        .catch((error) => {
                            console.log('\x1b[36m', 'namanh --- SignInError |  : ', error, '\x1b[0m');
                        });
                    break;
                case "signOut":
                    break;
                case "customOAuthState":
                    break;
            }
        };
        Hub.listen('auth', handleAuthEvent);
        return () => {
            Hub.remove('auth', handleAuthEvent);
        };
    }, []);
}

export default useAuthAmplifyHub;
