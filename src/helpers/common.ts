import streamApi from '~/api/StreamApi';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';
import { IPost } from '~/interfaces/IPost';
import { IParamGetReportContent } from '~/interfaces/IReport';
import { mockReportReason } from '~/test/mock_data/report';

export const removeMemberFromMemberList = (userId: string, membersData: object) => {
  let updatedData = {};
  let offset = 0;

  Object.keys(membersData).forEach((role: string) => {
    const memberRoleData = membersData[role].data;
    if (memberRoleData && membersData[role].name && membersData[role].userCount) {
      const newData = memberRoleData.filter((item: ICommunityMembers | IGroupMembers) => item.id !== userId);

      // need to update this for loading more data
      offset += newData.length;

      updatedData = {
        ...updatedData,
        [role]: {
          ...membersData[role],
          data: newData,
          userCount:
            newData.length !== memberRoleData.length ? membersData[role].userCount - 1 : membersData[role].userCount,
        },
      };
    }
  });

  return {
    ...updatedData,
    offset,
  };
};

export const moveItemOthersToEndInArray = (data: IPost) => {
  const indexItemisOthers = data.reportDetails.findIndex(
    (item) => item.description === mockReportReason[mockReportReason.length - 1].value,
  );
  if (indexItemisOthers > -1) {
    data.reportDetails.push(data.reportDetails.splice(indexItemisOthers, 1)[0]);
  }
  return data;
};

export const getReportContent = async ({ id, type }) => {
  let response = null;
  const paramGetReportContent: IParamGetReportContent = {
    order: 'ASC',
    offset: 0,
    limit: mockReportReason.length,
    targetIds: [id],
    targetType: type,
  };

  const responeReportContent = await streamApi.getReportContent(paramGetReportContent);

  if (responeReportContent?.data) {
    response = moveItemOthersToEndInArray(responeReportContent.data.list[0]);
  }

  return response;
};
