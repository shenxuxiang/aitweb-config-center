import React, { useEffect, useRef } from 'react';
import MenuItem from './MenuItem';
import styles from './index.module.less';
import { IMenuItem } from './index';

interface IProps {
  // 子菜单列表
  submenu: IMenuItem[];
  // 当前子菜单是否被打开，还是关闭
  isOpen: boolean;
  // 表示层级，1-第一层菜单；2-第二层子菜单；3-第三层子菜单；以此类推
  level: number;
  // 事件通知
  onClick: (id: string) => void;
  // 当前选择的菜单ID
  currentMenu: string;
}

export default function SubMenu(props: IProps) {
  const { submenu, isOpen, level, onClick, currentMenu } = props;
  const { length } = submenu;
  const boxRef = useRef<any>(null);
  const heightRef = useRef<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line
    if (boxRef.current == null) return;
    // isOpen === true 表示子菜单被打开；否则就是关闭
    if (isOpen) {
      // 计算菜单列表高度，并记录下来
      // eslint-disable-next-line
      if (heightRef.current === null) {
        heightRef.current = 40 * length + (length + 1) * 5;
      }
      // 将菜单的高度设置为上一次记录的高度。
      boxRef.current.style.height = `${heightRef.current}px`;
      // 设置一个定时器，在 height 过度效果完成后将 height 设置为 auto，
      // 这样可以使当前元素的 overflow: hidden 失效。
      // 这样做的目的是使当前菜单内的子菜单成功展示。
      setTimeout(() => (boxRef.current.style.height = 'auto'), 300);
    } else {
      // 添加这样一个开关的目的是为了在元素刚刚挂载到页面的时候，会触发一次，
      // 所以增加这个条件，因为此时子菜单元素不需要设置高度的，默认情况下，子菜单是隐藏的。
      // eslint-disable-next-line
      if (heightRef.current === null) return;
      // 每次关闭子菜单的时候，从新计算一次子菜单的高度。
      // 并将 height: auto 修改为具体的数值。否则动效就无法展示。
      heightRef.current = (boxRef.current as any).scrollHeight;
      boxRef.current.style.height = `${heightRef.current}px`;

      // 必须添加一个定时器，否则动画效果还是无法完成。
      setTimeout(() => (boxRef.current.style.height = '0px'), 0);
    }
  }, [isOpen]);

  return (
    <ul ref={boxRef} className={`${styles.menu} ${styles.submenu}`} style={{ height: 0 }}>
      {submenu.map((item: any) => (
        <MenuItem key={item.id} currentMenu={currentMenu} menu={item} level={level} onClick={onClick} />
      ))}
    </ul>
  );
}
