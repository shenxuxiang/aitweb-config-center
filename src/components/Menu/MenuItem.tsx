import React, { useState } from 'react';
import { isEmpty } from '@/utils/index';
import styles from './index.module.less';
import SubMenu from './SubMenu';
import Icon from '@/components/Icon';
import { IMenuItem } from './index';

interface IProps {
  // 菜单内容
  menu: IMenuItem;
  // 当前选中的菜单ID
  currentMenu: string;
  // 事件通知
  onClick: (id: string) => void;
  // 表示层级，1-第一层菜单；2-第二层子菜单；3-第三层子菜单；以此类推
  level: number;
}

export default function MenuItem(props: IProps) {
  const [show, setShow] = useState(false);
  const { menu, currentMenu, onClick, level } = props;
  const { title, id, icon, children } = menu;

  const handleClick = (event: any) => {
    const target = event.currentTarget;
    const role = target.getAttribute('data-role');
    const roleID = target.getAttribute('data-role-id');
    if (role === 'menuitem') {
      onClick(roleID);
    } else {
      setShow((prev) => !prev);
    }
  };
  if (isEmpty(children)) {
    return (
      <li
        className={`${styles.menu_item}${currentMenu === id ? ` ${styles.active}` : ''}`}
        data-role="menuitem"
        data-role-id={id}
        style={{ paddingLeft: level * 20 }}
        onClick={handleClick}
      >
        {icon ? <Icon name={icon} style={{ fontSize: 16, marginRight: 10 }} /> : null}
        {title}
      </li>
    );
  }
  return (
    <li className={`${styles.menu_item_submenu}`}>
      <div
        className={`${styles.menu_item_submenu_title}${show ? ` ${styles.active}` : ''}`}
        style={{ paddingLeft: level * 20 }}
        data-role="menuitem-submenu"
        data-role-id={id}
        onClick={handleClick}
      >
        {icon ? <Icon name={icon} style={{ fontSize: 16, marginRight: 10 }} /> : null}
        {title}
        <i className={`${styles.menu_item_submenu_allow} ${show ? styles.open : styles.close}`} />
      </div>
      <SubMenu submenu={children} isOpen={show} onClick={onClick} currentMenu={currentMenu} level={level + 1} />
    </li>
  );
}
