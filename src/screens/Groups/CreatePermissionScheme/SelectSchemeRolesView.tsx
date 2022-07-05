import React, {FC} from 'react';
import {IPermission} from '~/interfaces/IGroup';
import SchemeRoles from '~/screens/Groups/components/SchemeRoles';
import {useBaseHook} from '~/hooks';
import {getOrderedPermissionRoles} from '../redux/selectors';

export interface SelectSchemeRolesViewProps {
  onPressPermission?: (permission: IPermission, roleIndex: number) => void;
  onAnchorRole?: (index: number, role: any, anchor: number) => void;
}

const SelectSchemeRolesView: FC<SelectSchemeRolesViewProps> = ({
  onPressPermission,
  onAnchorRole,
}: SelectSchemeRolesViewProps) => {
  const {t} = useBaseHook();

  const roles = getOrderedPermissionRoles('creating');

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
