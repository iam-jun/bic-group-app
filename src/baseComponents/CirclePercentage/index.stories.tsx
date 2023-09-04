import { ComponentMeta } from '@storybook/react-native';
import { getStoryComponent } from '~/storybook';
import CirclePercentage from '.';

export default {
  title: 'base/CirclePercentage',
  component: CirclePercentage,
} as ComponentMeta<typeof CirclePercentage>;

const StoryComponent = getStoryComponent(CirclePercentage);

export const Default = StoryComponent.bind({});
Default.args = {
  percent: 60,
};
