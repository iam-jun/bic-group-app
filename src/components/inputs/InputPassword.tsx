import React from 'react';
import {TextInput, useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import Input, {TextInputProps} from './index';

const InputPassword: React.FC<TextInputProps> = ({...props}) => {
    const theme: IObject<any> = useTheme();
    const {spacing} = theme;
    const [hidePassword, setHidePassword] = React.useState(true);

    return (
        <Input
            {...props}
            secureTextEntry={hidePassword}
            right={
                <TextInput.Icon
                    style={{marginTop: spacing.margin.base}}
                    name={hidePassword ? 'eye' : 'eye-off'}
                    onPress={() => setHidePassword(!hidePassword)}
                />
            }
        />
    );
};

export default InputPassword;
