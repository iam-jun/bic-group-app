import {withBackgrounds} from '@storybook/addon-ondevice-backgrounds';
export const decorators = [withBackgrounds];
export const parameters = {
  backgrounds: [
    {name: 'plain', value: 'white',},
    {name: 'warm', value: 'hotpink',default: true},
    {name: 'cool', value: 'deepskyblue'},
  ],
};
