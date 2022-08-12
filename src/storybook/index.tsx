import React from 'react'
import { ComponentMeta } from '@storybook/react-native';
import StoryWrapper from './StoryWrapper';

// 👇 We create a “template” of how args map to rendering
const getStoryComponent = (Component) => (args) => (
  <StoryWrapper>
    <Component {...args} />
  </StoryWrapper>
);

export { ComponentMeta, getStoryComponent };
