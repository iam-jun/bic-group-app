import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {groupsStack} from '~/configs/navigator';
import * as groupsStacks from './stack';
import {IObject} from '~/interfaces/common';

const Stack = createStackNavigator();

const GroupStack = () => {
    const Stacks: IObject<any> = groupsStacks;
    return (
        <Stack.Navigator headerMode="screen" initialRouteName={groupsStack.groups}>
            <Stack.Screen
                name={groupsStack.groups}
                component={Stacks[groupsStack.groups]}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

export default GroupStack;
