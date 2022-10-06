import React, { FC } from 'react';
import { IPermission } from '~/interfaces/IGroup';
import SchemeRoles from '~/screens/groups/components/SchemeRoles';
import { useBaseHook } from '~/hooks';
import usePermissionSchemeStore from '../../store';

export interface SelectSchemeRolesViewProps {
  onPressPermission?: (permission: IPermission, roleIndex: number) => void;
  onAnchorRole?: (index: number, role: any, anchor: number) => void;
}

const SelectSchemeRolesView: FC<SelectSchemeRolesViewProps> = ({
  onPressPermission,
  onAnchorRole,
}: SelectSchemeRolesViewProps) => {
  const { t } = useBaseHook();

  const creatingSchemeData = usePermissionSchemeStore((state) => state.creatingScheme.data);
  const { roles = [] } = creatingSchemeData || {};

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
