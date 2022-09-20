import React, { memo, useLayoutEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import styles from './index.module.less';

/**
 * 分页器的计算有一定的复杂度。看看我们的原理分析：
 * 1: 如果页数小于等于 7，则全部展示。这是根据分页器的结构计算出来的：
 * 结构一: min, •••, middle - 2, middle - 1, middle, middle + 1, middle + 2, •••, max
 * 例如: 1, ..., 3, 4, 5, 6, 7, ..., 9
 * 结构二: min, middle - 2, middle - 1, middle, middle + 1, middle + 2, max,
 * 例如：1, 2, 3, 4, 5, 6, 7
 * 2: 如果页数大于等于 8，则进行如下计算：
 * 2-1: 如果 pageNum 为前 3 位，则展示为 1, 2, 3, 4, 5, •••, maxPage
 * 2-2: 如果 pageNum 为后 3 位，则展示为 1, •••, maxPage - 4, maxPage - 3, maxPage - 2, maxPage - 1, maxPage
 * 2-3: 如果 pageNum 为中间位，则以 pageNum 为界，将分页器分成左边和右边，然后分别进行计算；
 * 这里计算有一个规律，左边需要依次计算四个位置，右边同样也需要依次计算四个位置；
 * 所以左边的值计算必须始终要大于等于 1，右边的值计算始终要小于等于 pageMax。对于不满足这个条件的不展示。
 * 2-4: 与 pageNum 相邻的左边第一、第二的位置上必须展示数字，同样与 pageNum 相邻的右边第一、第二的位置上必须展示数字；
 * 与 pageNum 相邻的左右两边的第三个位置展示，可能是 ••• 也可能是 1/maxPage，这要看具体计算的值；
 * 左边: if pageNum - 3 > 1 则展示 ••• 否则展示 1
 * 右边: if pageNum + 3 < maxPage 则展示 ••• 否则展示 maxPage
 * 2-5: 第四个位置上一定展示的是 1/maxPage。
 */

interface IPaginationItem {
  isActive: boolean;
  counter: string | number;
}
interface IProps {
  pageSize: number;
  pageNum: number;
  total: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  jump?: boolean;
}

function Pagination(props: IProps) {
  const { pageSize, pageNum, total, onChange, disabled, className = '', jump } = props;
  const [state, setState] = useState<IPaginationItem[]>([]);
  // 计算最大页数
  const maxPageRef = useRef(Math.ceil(total / pageSize));

  useLayoutEffect(() => {
    // 每当 pageSize、pageNum、total 变化时重新计算。
    const maxPage = Math.ceil(total / pageSize);
    maxPageRef.current = maxPage;
    const stack: IPaginationItem[] = [];
    if (maxPage <= 7) {
      for (let i = 1; i <= maxPage; i++) {
        stack.push({ isActive: i === pageNum, counter: i });
      }
    } else if (pageNum <= 3) {
      // 展示内容形式: 1, 2, 3, 4, 5, •••, maxPage
      for (let i = 1; i <= 7; i++) {
        if (i <= 5) {
          stack.push({ counter: i, isActive: i === pageNum });
        } else if (i === 6) {
          stack.push({ counter: 'forward', isActive: false });
        } else {
          stack.push({ counter: maxPage, isActive: false });
        }
      }
    } else if (pageNum + 3 > maxPage) {
      // 展示内容形式: 1, •••, maxPage - 4, maxPage - 3, maxPage - 2, maxPage - 1, maxPage
      for (let i = 6; i >= 0; i--) {
        if (i === 6) {
          stack.push({ counter: 1, isActive: false });
        } else if (i === 5) {
          stack.push({ counter: 'back', isActive: false });
        } else {
          stack.push({ counter: maxPage - i, isActive: maxPage - i === pageNum });
        }
      }
    } else {
      stack.push({ counter: pageNum, isActive: true });
      for (let i = 1; i <= 4; i++) {
        // 计算 pageNum 左边
        // 当 pageNum - i 必须大于 0，才会展示出来。否则不展示。
        if (pageNum - i > 0) {
          // pageNum 左边前两位必须展示为数字。
          if (i <= 2) {
            stack.unshift({ counter: pageNum - i, isActive: false });
          } else if (i === 3) {
            // 如果 pageNum 的左边第三位等于 1 时，就展示 1。
            // 如果 pageNum 的左边第三位大于 1 时，则展示 •••。
            if (pageNum - i > 1) {
              stack.unshift({ counter: 'back', isActive: false });
            } else {
              stack.unshift({ counter: 1, isActive: false });
            }
          } else {
            // 注意，pageNum 的左边第四位必须展示为 1。
            stack.unshift({ counter: 1, isActive: false });
          }
        }

        // 计算 pageNum 右边
        // 当 pageNum + i 必须小于等于 maxPage，才会展示出来。否则不展示。
        if (pageNum + i <= maxPage) {
          if (i <= 2) {
            // pageNum 右边前两位必须展示为数字。
            stack.push({ counter: pageNum + i, isActive: false });
          } else if (i === 3) {
            // 如果 pageNum 的右边第三位小于 maxPage，则展示 •••。
            // 如果 pageNum 的右边第三位等于 maxPage，则展示 maxPage。
            if (pageNum + i < maxPage) {
              stack.push({ counter: 'forward', isActive: false });
            } else {
              stack.push({ counter: maxPage, isActive: false });
            }
          } else {
            // 注意，pageNum 的右边第四位必须展示为 maxPage。
            stack.push({ counter: maxPage, isActive: false });
          }
        }
      }
    }
    setState(() => stack);
  }, [total, pageSize, pageNum]);

  const handleClickItem = (event: any) => {
    const { target } = event;
    let newCount = pageNum;
    if (target.getAttribute('data-disabled') === 'true') return;

    if (target.matches(`li.${styles.prev}`)) {
      // 上一页
      if (pageNum === 1) return;
      onChange(pageNum - 1);
    } else if (target.matches(`li.${styles.next}`)) {
      // 下一页
      if (pageNum === maxPageRef.current) return;
      onChange(pageNum + 1);
    } else if (target.matches(`li.${styles.dot}`)) {
      const role = target.getAttribute('data-role');
      if (role === 'forward') {
        // 向前 5 页
        newCount += 5;
        newCount = newCount >= maxPageRef.current ? maxPageRef.current : newCount;
      } else {
        // 向后 5 页
        newCount -= 5;
        newCount = newCount <= 1 ? 1 : newCount;
      }
      onChange(newCount);
    } else if (target.matches(`li.${styles.ait_pagination_item}`)) {
      // 跳转到指定页
      newCount = Number(target.getAttribute('data-index'));
      onChange(newCount);
    }
  };

  // 跳至指定额页面
  const handleJump = (event: any) => {
    // 是否点击回车按钮
    if (event.keyCode !== 13) return;

    let { value } = event.target;
    if (/^-?\d+$/.test(value)) {
      if (value > maxPageRef.current) {
        value = maxPageRef.current;
      } else if (value < 1) {
        value = 1;
      }

      onChange(Number(value));
    }
    event.target.value = '';
  };

  if (total <= 0) return null;
  return (
    <ul
      className={classnames(styles.ait_pagination, {
        [className]: !!className,
      })}
      onClick={handleClickItem}
    >
      <li
        title="上一页"
        data-disabled={disabled ? 'true' : 'false'}
        className={classnames(styles.ait_pagination_item, styles.prev, {
          [styles.disabled]: pageNum === 1,
        })}
      >
        &lt;
      </li>
      {state.map((item, index) => {
        if (typeof item.counter === 'string') {
          return (
            <li
              key={index}
              data-disabled={disabled ? 'true' : 'false'}
              className={classnames(styles.ait_pagination_item, styles.dot, {
                [styles.active]: item.isActive,
              })}
              data-role={item.counter}
              title={`向${item.counter === 'forward' ? '前' : '后'}5页`}
            >
              •••
              <span>
                <Icon name={item.counter === 'back' ? 'houtui' : 'qianjin'} className={styles.pagination_jump_icon} />
              </span>
            </li>
          );
        }
        return (
          <li
            key={index}
            data-index={item.counter}
            data-disabled={disabled ? 'true' : 'false'}
            className={classnames(styles.ait_pagination_item, {
              [styles.active]: item.isActive,
            })}
          >
            {item.counter}
          </li>
        );
      })}
      <li
        title="下一页"
        data-disabled={disabled ? 'true' : 'false'}
        className={classnames(styles.ait_pagination_item, styles.next, {
          [styles.disabled]: pageNum === maxPageRef.current,
        })}
      >
        &gt;
      </li>
      {jump ? (
        <li data-disabled={disabled ? 'true' : 'false'} className={styles.ait_pagination_item_jump}>
          跳至
          <Input
            type="text"
            className={styles.ait_pagination_item_jump_input}
            disabled={disabled}
            onKeyUp={handleJump}
          />
          页
        </li>
      ) : null}
    </ul>
  );
}

export default memo(Pagination);
