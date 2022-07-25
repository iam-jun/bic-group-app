import React, { FC } from 'react';
import { IPermission } from '~/interfaces/IGroup';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import SchemeRoles from '~/screens/Groups/components/SchemeRoles';
import { useBaseHook } from '~/hooks';

export interface SelectSchemeRolesViewProps {
  onPressPermission?: (permission: IPermission, roleIndex: number) => void;
  onAnchorRole?: (index: number, role: any, anchor: number) => void;
}

const SelectSchemeRolesView: FC<SelectSchemeRolesViewProps> = ({
  onPressPermission,
  onAnchorRole,
}: SelectSchemeRolesViewProps) => {
  const { t } = useBaseHook();

  const roles = useKeySelector(groupsKeySelector.permission.creatingScheme.roles) || [];

  return (
    <SchemeRoles
      roles={roles}
      onAnchorRole={onAnchorRole}
      title={t('communities:permission:title_edit_roles')}
      onPressPermission={onPressPermission}
    />
  );
};

export default SelectSchemeRolesView;
