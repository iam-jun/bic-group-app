import React, {FC} from 'react';
import {IPermission} from '~/interfaces/IGroup';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import SchemeRoles from '~/screens/Groups/CreatePermissionScheme/SchemeRoles';
import {useBaseHook} from '~/hooks';

export interface SelectSchemeRolesViewProps {
  onPressPermission?: (permission: IPermission, roleIndex: number) => void;
}

const SelectSchemeRolesView: FC<SelectSchemeRolesViewProps> = ({
  onPressPermission,
}: SelectSchemeRolesViewProps) => {
  const {t} = useBaseHook();

  const roles =
    useKeySelector(groupsKeySelector.permission.creatingScheme.roles) || [];

  return (
    <SchemeRoles
      roles={roles}
      title={t('communities:permission:title_edit_roles')}
      onPressPermission={onPressPermission}
    />
  );
};

export default SelectSchemeRolesView;
