import streamApi from '~/api/StreamApi';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';
import { IParamGetReportContent } from '~/interfaces/IReport';
import { mockReportReason } from '~/test/mock_data/report';
import { IUserProfile } from '~/interfaces/IAuth';

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
    response = { ...responeReportContent.data.list[0] };
  }

  return response;
};

export const getAllAudiences = (selectedAudiences) => {
  const groupAudiences = Object.keys(selectedAudiences.groups).map(
    (key: string) => selectedAudiences.groups[key],
  );
  const userAudiences = Object.keys(selectedAudiences.users).map(
    (key: string) => selectedAudiences.users[key],
  );

  return groupAudiences.concat(userAudiences);
};

export const getTitlePostItemInSeries = (content: string) => {
  if (!content) return '';

  const firstParagraphRegex = /^.*?(?=\n)/s;
  const firstSentenceRegex = /^[^.!?]*[.!?]/s;

  const firstParagraph = content.match(firstParagraphRegex)?.[0];
  const firstSentence = (firstParagraph || content).match(firstSentenceRegex)?.[0];

  if (firstSentence) return firstSentence;
  if (firstParagraph) return firstParagraph;

  return content;
};

export const getSummaryPostItemInSeires = (content: string, titlePost: string) => {
  if (!content && !titlePost) return '';

  const updatedParagraph = content.replace(titlePost, '');

  return updatedParagraph?.trim() || '';
};

export const mapProfile = (data: any): IUserProfile => ({ ...data, language: data?.language || [] });
