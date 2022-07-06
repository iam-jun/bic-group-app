import {
  changeSchemeIdOfGroup,
  handleSelectNewGroupScheme,
} from '~/screens/Groups/GroupSchemeAssignSelection/helper';

describe('group scheme assign selection helper', () => {
  const assignments = {
    group_id: 1,
    scheme_id: 'efgh',
    name: 'Town Square',
    level: 0,
    privacy: 'PUBLIC',
    icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/e55a5e2f-5f61-4a1b-ad3f-623f08eec1a1',
    description: 'The greatest community ever yeahhhhhhhhhh 123',
    children: [
      {
        group_id: 2,
        scheme_id: null,
        name: 'Crypto Inner Circle',
        level: 1,
        privacy: 'PUBLIC',
        icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a6d32c52-c622-4600-bb89-f28b1510047b',
        description: 'https://fe.sbx.beincomm.com/groups/2',
      },
    ],
  };

  it('handleSelectNewGroupScheme should add new item if has change with current assignments', () => {
    const data: any = [];
    const groupId = 1;
    const schemeId = 'abcd';
    expect(
      handleSelectNewGroupScheme(groupId, schemeId, data, assignments),
    ).toEqual([{group_id: groupId, scheme_id: schemeId}]);
  });

  it('handleSelectNewGroupScheme should not add new item if not has change with current assignments', () => {
    const data: any = [];
    const groupId = 1;
    const schemeId = 'efgh';
    expect(
      handleSelectNewGroupScheme(groupId, schemeId, data, assignments),
    ).toEqual([]);
  });

  it('changeSchemeIdOfGroup should update schemeId of group by groupId', () => {
    const groupId = 1;
    const schemeId = 'abcd';
    const expectResult = {
      group_id: 1,
      scheme_id: 'abcd',
      name: 'Town Square',
      level: 0,
      privacy: 'PUBLIC',
      icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/e55a5e2f-5f61-4a1b-ad3f-623f08eec1a1',
      description: 'The greatest community ever yeahhhhhhhhhh 123',
      children: [
        {
          group_id: 2,
          scheme_id: null,
          name: 'Crypto Inner Circle',
          level: 1,
          privacy: 'PUBLIC',
          icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a6d32c52-c622-4600-bb89-f28b1510047b',
          description: 'https://fe.sbx.beincomm.com/groups/2',
        },
      ],
    };
    expect(changeSchemeIdOfGroup(groupId, schemeId, assignments)).toEqual(
      expectResult,
    );
  });

  it('changeSchemeIdOfGroup should update schemeId of child group by groupId', () => {
    const groupId = 2;
    const schemeId = 'efgh';
    const expectResult = {
      group_id: 1,
      scheme_id: 'efgh',
      name: 'Town Square',
      level: 0,
      privacy: 'PUBLIC',
      icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/e55a5e2f-5f61-4a1b-ad3f-623f08eec1a1',
      description: 'The greatest community ever yeahhhhhhhhhh 123',
      children: [
        {
          group_id: 2,
          scheme_id: 'efgh',
          name: 'Crypto Inner Circle',
          level: 1,
          privacy: 'PUBLIC',
          icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a6d32c52-c622-4600-bb89-f28b1510047b',
          description: 'https://fe.sbx.beincomm.com/groups/2',
        },
      ],
    };
    expect(changeSchemeIdOfGroup(groupId, schemeId, assignments)).toEqual(
      expectResult,
    );
  });

  it('changeSchemeIdOfGroup should not update any thing', () => {
    const groupId = 99;
    const schemeId = 'efgh';
    expect(changeSchemeIdOfGroup(groupId, schemeId, assignments)).toEqual(
      assignments,
    );
  });
});
