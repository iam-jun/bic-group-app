/* eslint-disable no-alert */
import Banner from '.';
import { ComponentMeta, getStoryComponent } from '~/storybook';

export default {
  title: 'components/Banner',
  component: Banner,
} as ComponentMeta<typeof Banner>;

const StoryComponent = getStoryComponent(Banner);

export const Default = StoryComponent.bind({});
Default.args = {
  markedAsRead: false,
}
