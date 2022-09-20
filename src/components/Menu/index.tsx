import React, { useState, useCallback, memo, useEffect } from 'react';
import styles from './index.module.less';
import MenuItem from './MenuItem';

export interface IMenuItem {
  icon?: string;
  id: string;
  title: string;
  children?: IMenuItem[];
}
type IMenuList = IMenuItem[];
interface IProps {
  menuList: IMenuList;
  onClick: (id: string) => void;
  currentMenu: string;
}

function Menu(props: IProps) {
  const { menuList, onClick, currentMenu } = props;
  const [state, setState] = useState(currentMenu);
  // 如果外部传入的 currentMenu 变化了，便立即更新
  useEffect(() => setState(currentMenu), [currentMenu]);

  const handleClick = useCallback(
    (id: string) => {
      setState(() => id);
      onClick(id);
    },
    [onClick],
  );
  return (
    <ul className={styles.menu}>
      {menuList.map((item) => (
        <MenuItem key={item.id} level={1} menu={item} currentMenu={state} onClick={handleClick} />
      ))}
    </ul>
  );
}

export default memo(Menu);
