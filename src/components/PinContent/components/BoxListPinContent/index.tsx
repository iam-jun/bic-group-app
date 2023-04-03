import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import usePinContentStore from '../../store';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import PinContentItem from './components/PinContentItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface BoxListPinContentProps {
    id: string;
}

const BoxListPinContent: React.FC<BoxListPinContentProps> = ({
  id,
}) => {
  // const { data, isLoading } = usePinContentStore((state) => state.groupPinContent?.[id]);
  const actions = usePinContentStore((state) => state.actions);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  useEffect(() => {
    actions.getPinContentsGroup();
  }, [id]);

  const renderItem = ({ item }) => <PinContentItem data={item} />;

  const renderHeaderComponent = () => <ViewSpacing width={spacing.margin.large} />;

  const renderFooterComponent = () => (
    <View style={styles.footer}>
      <ActivityIndicator size="small" color={colors.gray30} />
    </View>
  );

  const renderSeparatorComponent = () => <ViewSpacing width={spacing.margin.large} />;

  return (
    <View style={styles.container}>
      <View style={styles.boxTitle}>
        <Text.SubtitleM useI18n color={colors.neutral40}>
          pin:list_pin_content_title
        </Text.SubtitleM>
      </View>
      <FlatList
        horizontal
        data={fake_data}
        renderItem={renderItem}
        ListHeaderComponent={renderHeaderComponent}
        ListFooterComponent={renderFooterComponent}
        ItemSeparatorComponent={renderSeparatorComponent}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={5}
      />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.purple1,
      paddingBottom: spacing.padding.large,
      height: 280,
    },
    boxTitle: {
      paddingVertical: spacing.padding.base,
      paddingLeft: spacing.padding.extraLarge,
    },
    footer: {
      width: '100%',
      height: '100%',
      alignContent: 'center',
      justifyContent: 'center',
    },
  });
};

export default BoxListPinContent;

const fake_data = [
  {
    id: 'f270eb32-eb6f-4a0f-bff2-a8afef9d44bf',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      isDeactivated: false,
      username: 'trannamanh',
    },
    coverMedia: {
      createdAt: '2023-03-24T02:53:43.911Z',
      createdBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      extension: 'jpeg',
      height: 686,
      id: '995c7abb-b41b-45c1-8b58-46c4687f0107',
      mimeType: 'image/jpeg',
      name: '5f9620da-1943-4a7b-88b8-ff1937bcdc21.jpg',
      originName: '2E236051-EB52-4AFB-827D-AAC5162B1837.jpg',
      size: 217206,
      status: 'completed',
      thumbnails: null,
      type: 'image',
      url: 'https://bic-dev-user-upload-images-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/5f9620da-1943-4a7b-88b8-ff1937bcdc21.jpg',
      width: 1200,
    },
    title: 'test title cai nha sdfsdf sdfs fsdf sdf sdf sdf sdfsdfs df sdf sdf sdf sd fsdfsdfsfsdfs dfsfd',
    updatedAt: '2023-03-25T02:55:00.012Z',
    type: 'SERIES',
    createdAt: '2023-04-03T04:23:25.345Z',
  },
  {
    id: 'b1786c52-21f0-44c9-9c37-6574d959f5dc',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      username: 'trannamanh',
    },
    title: '16 dự án xây dựng đường ven biển, kết nối vùng, đê bao chống sạt',
    summary: 'Các dự án đã được hai bộ Giao thông Vận tải, Nông nghiệp và Phát triển Nông thôn cùng 13 tỉnh, thành miền Tây thống nhất đề xuất. Trong đó, vốn vay nước ngoài hơn 2,8 tỷ USD (tương đương 66.282 tỷ đồng), vốn đối ứng hơn 28.000 tỷ đồng. Một số dự án có mức',
    type: 'ARTICLE',
    createdAt: '2023-04-03T04:23:25.345Z',
  },
  {
    id: 'daa5e2f4-d808-460c-bf0a-f14882499d56',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      username: 'trannamanh',
    },
    content: 'Một số dự án có mức đầu tư lớn như: hệ thống đường ven biển dài 415 km đi qua 7 tỉnh: Tiền Giang, Bến Tre, Trà Vinh, Sóc Trăng, Bạc Liêu, Cà Mau, Kiên Giang, với tổng mức đầu tư gần 43.000 tỷ đồng. Hoàn thiện đê bao sông Măng Thít (giai đoạn 2) vốn hơn 4.150 tỷ đồng (Vĩnh Long); nâng cấp mở rộng quốc lộ 61C dài hơn 37 km (3.888 tỷ đồng, Hậu Giang); hạ tầng đường bộ khu vực nam sông Tiền (4.260 tỷ đồng, Đồng Tháp); xây hệ thống hồ trữ ngọt gắn với hạ tầng thủy lợi phục vụ liên kết sản xuất tiểu vùng Tứ giác Long Xuyên (hơn 2.660 tỷ đồng, An Giang). TP Cần Thơ muốn đầu tư gần 9.800 tỷ đồng cho dự án Phát triển bền vững thích ứng biến đổi khí hậu, gồm các hợp phần: mở rộng 10,2 km quốc lộ 61C (đoạn qua địa bàn), đường kết nối Ô Môn - Thới Lai - Giồng Riềng dài 22,5 km, xây cầu Ô Môn qua sông Hậu kết nối Cần Thơ với Đồng Tháp.',
    type: 'POST',
    createdAt: '2023-04-03T04:23:25.345Z',
  },
  {
    id: 'daa5e2f4-d808-460c-bf0a-f14882499d56',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      is_deactivated: false,
      username: 'trannamanh',
    },
    media: {
      images: [
        {
          extension: 'jpeg',
          height: 2002,
          id: 'a98cbec5-1e25-4592-83a1-b6435aabb74c',
          mimeType: 'image/jpeg',
          name: '6fbb90b1-ad1c-4e29-936d-02f024a01f5e.jpg',
          originName: 'F738F17E-28AD-4F2A-927A-DEDA0A96EFE5.jpg',
          size: 4276633,
          status: 'completed',
          type: 'image',
          url: 'https://bic-dev-user-upload-images-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/6fbb90b1-ad1c-4e29-936d-02f024a01f5e.jpg',
          width: 3000,
        },
        {
          extension: 'jpeg',
          height: 576,
          id: '4d212a93-1cf3-4dbc-80cb-3d587557715f',
          mimeType: 'image/jpeg',
          name: 'dba739a9-95dc-4c4d-8514-166129a9429a.jpg',
          originName: 'B684AAED-C464-448D-BA90-9B220913332E.jpg',
          size: 226116,
          status: 'completed',
          type: 'image',
          url: 'https://bic-dev-user-upload-images-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/dba739a9-95dc-4c4d-8514-166129a9429a.jpg',
          width: 1024,
        },
      ],
    },
    createdAt: '2023-04-03T04:23:25.345Z',
  },
  {
    id: 'daa5e2f4-d808-460c-bf0a-f14882499d56',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      username: 'trannamanh',
    },
    media: {
      images: [
        {
          extension: 'jpeg',
          height: 1200,
          id: '4f0a46e6-7ecb-4242-b4dc-f910bac493d9',
          mimeType: 'image/jpeg',
          name: '65d9ca2f-c860-4436-9120-ba2b73b42aee.jpg',
          originName: '190DD2F9-A57A-4FED-BA77-7AED44262614.jpg',
          size: 110319,
          status: 'completed',
          type: 'image',
          url: 'https://bic-dev-user-upload-images-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/65d9ca2f-c860-4436-9120-ba2b73b42aee.jpg',
          width: 800,
        },
      ],
    },
    createdAt: '2023-04-03T04:23:25.345Z',
  },
  {
    id: 'daa5e2f4-d808-460c-bf0a-f14882499d56',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      username: 'trannamanh',
    },
    media: {
      videos: [
        {
          thumbnails: [
            {
              width: 427,
              height: 240,
              url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/452a6735-943e-4ea2-8c97-8648e18a1248_427x240.jpg',
            },
            {
              width: 640,
              height: 360,
              url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/452a6735-943e-4ea2-8c97-8648e18a1248_640x360.jpg',
            },
            {
              width: 853,
              height: 480,
              url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/452a6735-943e-4ea2-8c97-8648e18a1248_853x480.jpg',
            },
            {
              width: 1280,
              height: 720,
              url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/452a6735-943e-4ea2-8c97-8648e18a1248_1280x720.jpg',
            },
          ],
          id: '452a6735-943e-4ea2-8c97-8648e18a1248',
          status: 'completed',
          name: 'testvideo.mp4',
          url: 'https://cdn.beincom.io/media/hls/452a6735-943e-4ea2-8c97-8648e18a1248.m3u8',
          size: 1570024,
          width: 480,
          height: 270,
          originName: 'testvideo.mp4',
          extension: null,
          mimeType: 'video/mp4',
          type: 'video',
        },
      ],
    },
    createdAt: '2023-04-03T04:23:25.345Z',
  },
  {
    id: 'daa5e2f4-d808-460c-bf0a-f14882499d56',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      username: 'trannamanh',
    },
    media: {
      videos: [
        {
          thumbnails: [
            {
              width: 135,
              height: 240,
              url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/9ccbdac4-446c-4b76-8ec7-19229bb1bb78_135x240.jpg',
            },
            {
              width: 203,
              height: 360,
              url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/9ccbdac4-446c-4b76-8ec7-19229bb1bb78_203x360.jpg',
            },
            {
              width: 270,
              height: 480,
              url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/9ccbdac4-446c-4b76-8ec7-19229bb1bb78_270x480.jpg',
            },
            {
              width: 405,
              height: 720,
              url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/9ccbdac4-446c-4b76-8ec7-19229bb1bb78_405x720.jpg',
            },
          ],
          id: '9ccbdac4-446c-4b76-8ec7-19229bb1bb78',
          status: 'completed',
          name: '2.mp4',
          url: 'https://cdn.beincom.io/media/hls/9ccbdac4-446c-4b76-8ec7-19229bb1bb78.m3u8',
          size: 64166250,
          width: 576,
          height: 1024,
          originName: '2.mp4',
          extension: null,
          mimeType: 'video/mp4',
          type: 'video',
        },
      ],
    },
    createdAt: '2023-04-03T04:23:25.345Z',
  },
  {
    id: 'daa5e2f4-d808-460c-bf0a-f14882499d56',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      is_deactivated: false,
      username: 'trannamanh',
    },
    media: {
      files: [
        {
          id: '824882ec-6f61-4d92-9219-fefa9720ebf9',
          name: 'file-excel-tinh-thue-thu-nhap-ca-nhan_2811135037.xlsx',
          size: 19009,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/824882ec-6f61-4d92-9219-fefa9720ebf9',
          origin_name: 'file-excel-tinh-thue-thu-nhap-ca-nhan_2811135037.xlsx',
          extension: null,
          mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          type: 'file',
        },
        {
          id: '09dcae74-f6cd-4452-ae82-022953bda683',
          name: 'Maugiay-chung-nhan-dang-ky-ket-hon.pdf',
          size: 3275780,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/09dcae74-f6cd-4452-ae82-022953bda683',
          origin_name: 'Maugiay-chung-nhan-dang-ky-ket-hon.pdf',
          extension: null,
          mime_type: 'application/pdf',
          type: 'file',
        },
      ],
    },
    createdAt: '2023-04-03T04:23:25.345Z',
  },
  {
    id: 'daa5e2f4-d808-460c-bf0a-f14882499d56',
    actor: {
      avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      username: 'trannamanh',
    },
    media: {
      files: [
        {
          id: '2c245060-2551-41f4-ae1f-c6d13480a0eb',
          name: '13fc741c-06c9-4bb7-855a-f2a55e2fd75a (3).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/2c245060-2551-41f4-ae1f-c6d13480a0eb',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: '601f78b2-b652-4987-8baf-f8b0736c9096',
          name: '越南 (1).txt',
          size: 12363,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/601f78b2-b652-4987-8baf-f8b0736c9096',
          originName: null,
          extension: null,
          mimeType: 'text/plain',
          type: 'file',
        },
        {
          id: '5c4f5e34-95fb-4908-b99b-6b65ca380d33',
          name: '越南.txt',
          size: 12363,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/5c4f5e34-95fb-4908-b99b-6b65ca380d33',
          originName: null,
          extension: null,
          mimeType: 'text/plain',
          type: 'file',
        },
        {
          id: 'b5619b4d-3e3a-465c-ab2c-db845c2eb538',
          name: '0c30b5a9-cf35-4861-81bd-94cf0f281e76.pdf',
          size: 134455,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/b5619b4d-3e3a-465c-ab2c-db845c2eb538',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: '67f5a280-c904-47ec-9bf1-1450ea024a53',
          name: 'Cam kết ủng hộ Beincomm (BIC) tuyệt đối - Private (1).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/67f5a280-c904-47ec-9bf1-1450ea024a53',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: '67d00750-d86e-4bcd-85b9-ec04acf71002',
          name: 'd28fad79-a2ac-4313-ba85-7ccc3fd0ca6c (11).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/67d00750-d86e-4bcd-85b9-ec04acf71002',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: '7663f9bf-8801-49d4-9932-83951af701d6',
          name: 'd28fad79-a2ac-4313-ba85-7ccc3fd0ca6c (3) (1).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/7663f9bf-8801-49d4-9932-83951af701d6',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: 'c83a7bc9-90f0-46f0-930a-96b38d91f467',
          name: 'd28fad79-a2ac-4313-ba85-7ccc3fd0ca6c (13).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/c83a7bc9-90f0-46f0-930a-96b38d91f467',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: 'f20c5e25-7fec-41ee-a974-5a2c8deb878f',
          name: '47404c4d-9195-4ffb-abcf-a4fee869031b.pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/f20c5e25-7fec-41ee-a974-5a2c8deb878f',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: 'ad36e58b-f048-4b39-bab2-b5f945ca52d5',
          name: 'd28fad79-a2ac-4313-ba85-7ccc3fd0ca6c (6).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/ad36e58b-f048-4b39-bab2-b5f945ca52d5',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: '0709b549-a80d-406e-9571-16475c6f390e',
          name: 'd28fad79-a2ac-4313-ba85-7ccc3fd0ca6c (9).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/0709b549-a80d-406e-9571-16475c6f390e',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: '078f54e7-ae6e-4ce3-ba4e-81c7e4dc9fdf',
          name: 'd28fad79-a2ac-4313-ba85-7ccc3fd0ca6c (8).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/078f54e7-ae6e-4ce3-ba4e-81c7e4dc9fdf',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: 'dd3a24b6-d6c2-474a-9a4d-a5e778f56f68',
          name: '13fc741c-06c9-4bb7-855a-f2a55e2fd75a.pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/dd3a24b6-d6c2-474a-9a4d-a5e778f56f68',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: '0cd121b5-c439-43ca-8ee7-f297bbb37198',
          name: 'd28fad79-a2ac-4313-ba85-7ccc3fd0ca6c (12).pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/0cd121b5-c439-43ca-8ee7-f297bbb37198',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
        {
          id: 'e621dae9-3f24-4710-8bba-4f024cc52f5f',
          name: '358e95c0-d746-47f6-8c18-afa4f6633bb2.pdf',
          size: 150881,
          status: 'completed',
          url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/e621dae9-3f24-4710-8bba-4f024cc52f5f',
          originName: null,
          extension: null,
          mimeType: 'application/pdf',
          type: 'file',
        },
      ],
    },
    createdAt: '2023-04-03T04:23:25.345Z',
  },
];
