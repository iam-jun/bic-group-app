import React, { FC } from 'react';
import ContentHeader from '~/components/ContentView/components/ContentHeader';
import { useRootNavigation } from '~/hooks/navigation';
import { IPost } from '~/interfaces/IPost';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

type SeriesHeaderProps = {
  series: IPost;
  disabled?: boolean;
};

const SeriesHeader: FC<SeriesHeaderProps> = ({ series, disabled }) => {
  const { actor, audience, id } = series;
  const { rootNavigation } = useRootNavigation();

  const goToSeriesDetail = () => {
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: id });
  };

  const onPressHeader = () => {
    goToSeriesDetail();
  };

  const onPressMenu = () => {
    // do something
  };

  return (
    <ContentHeader
      actor={actor}
      disabled={disabled}
      audience={audience}
      onPressHeader={onPressHeader}
      onPressMenu={onPressMenu}
    />
  );
};

export default SeriesHeader;
