import { GROUP_ASSIGNMENTS } from '~/test/mock_data/group';
import {
  findGroupInAssignmentsById,
  prepareData,
} from '~/screens/Groups/GroupSchemeAssignment/components/AlertAssignGroupConfirmContent';
import { languages } from '~/test/testUtils';

describe('AlertAssignGroupConfirmContent', () => {
  it('findGroupInAssignmentsById should return group level 0', () => {
    const assignments = GROUP_ASSIGNMENTS;
    const { groupId } = GROUP_ASSIGNMENTS;
    expect(findGroupInAssignmentsById(groupId, assignments)).toEqual(
      GROUP_ASSIGNMENTS,
    );
  });

  it('findGroupInAssignmentsById should return child group', () => {
    const assignments = GROUP_ASSIGNMENTS;
    const { groupId } = GROUP_ASSIGNMENTS.children[0];
    expect(findGroupInAssignmentsById(groupId, assignments)).toEqual(
      GROUP_ASSIGNMENTS.children[0],
    );
  });

  it('findGroupInAssignmentsById should return nothing', () => {
    const assignments = GROUP_ASSIGNMENTS;
    const groupId = '999';
    expect(findGroupInAssignmentsById(groupId, assignments)).toBeUndefined();
  });

  it('prepareData should return correct result', () => {
    const initAssignments = GROUP_ASSIGNMENTS;
    const assigningData = [{ groupId: '1', schemeId: 'abcd' }];
    const allSchemes = {
      abcd: { id: 'abcd', name: 'Scheme ABCD' },
      efgh: { id: 'efgh', name: 'Scheme EFGH' },
    };
    expect(prepareData(initAssignments, assigningData, allSchemes)).toEqual([
      {
        groupName: GROUP_ASSIGNMENTS.name,
        oldSchemeName: allSchemes.efgh.name,
        newSchemeName: allSchemes.abcd.name,
      },
    ]);
  });

  it('prepareData should return empty result', () => {
    const initAssignments = GROUP_ASSIGNMENTS;
    const assigningData = [{ groupId: '111', schemeId: 'abcd' }];
    const allSchemes = {
      abcd: { id: 'abcd', name: 'Scheme ABCD' },
      efgh: { id: 'efgh', name: 'Scheme EFGH' },
    };
    expect(prepareData(initAssignments, assigningData, allSchemes)).toEqual([]);
  });

  it('prepareData should return correct result with default unknown scheme name', () => {
    const initAssignments = GROUP_ASSIGNMENTS;
    const assigningData = [{ groupId: '1', schemeId: 'ijkl' }];
    const allSchemes = {
      abcd: { id: 'abcd', name: 'Scheme ABCD' },
      efgh: { id: 'efgh', name: 'Scheme EFGH' },
    };
    expect(prepareData(initAssignments, assigningData, allSchemes)).toEqual([
      {
        groupName: GROUP_ASSIGNMENTS.name,
        oldSchemeName: allSchemes.efgh.name,
        newSchemeName: languages.communities.permission.text_unknown_scheme,
      },
    ]);
  });

  it('prepareData should return correct result with new none group', () => {
    const initAssignments = { ...GROUP_ASSIGNMENTS };
    const assigningData = [{ groupId: '1', schemeId: null }];
    const allSchemes = {
      abcd: { id: 'abcd', name: 'Scheme ABCD' },
      efgh: { id: 'efgh', name: 'Scheme EFGH' },
    };
    expect(prepareData(initAssignments, assigningData, allSchemes)).toEqual([
      {
        groupName: GROUP_ASSIGNMENTS.name,
        oldSchemeName: allSchemes.efgh.name,
        newSchemeName: languages.communities.permission.text_none_scheme,
      },
    ]);
  });

  it('prepareData should return correct result with old none scheme', () => {
    const initAssignments = { ...GROUP_ASSIGNMENTS };
    initAssignments.schemeId = null;
    const assigningData = [{ groupId: '1', schemeId: 'efgh' }];
    const allSchemes = {
      abcd: { id: 'abcd', name: 'Scheme ABCD' },
      efgh: { id: 'efgh', name: 'Scheme EFGH' },
    };
    expect(prepareData(initAssignments, assigningData, allSchemes)).toEqual([
      {
        groupName: GROUP_ASSIGNMENTS.name,
        oldSchemeName: languages.communities.permission.text_none_scheme,
        newSchemeName: allSchemes.efgh.name,
      },
    ]);
  });
});
