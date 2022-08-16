/* eslint-disable no-alert */
import { ComponentMeta } from '@storybook/react-native';
import Banner from '.';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/Banner',
  component: Banner,
} as ComponentMeta<typeof Banner>;

const StoryComponent = getStoryComponent(Banner);

export const Default = StoryComponent.bind({});
Default.args = {
  markedAsRead: false,
}
