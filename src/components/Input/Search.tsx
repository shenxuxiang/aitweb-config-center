import React, { memo, useMemo, useCallback } from 'react';
import Input, { InputProps } from './Input';
import Icon from '@/components/Icon';

type IProps = { onSearch: () => void } & InputProps;
export type SearchProps = Omit<IProps, 'suffix'>;

function Search(props: SearchProps) {
  const { onSearch, onKeyUp } = props;

  const renderSearchIcon = useMemo(
    () => <Icon name="sousuo" className="ait-input-suffix-search-icon" onClick={onSearch} />,
    [onSearch],
  );

  const handleKeyUp = useCallback(
    (event: any) => {
      onKeyUp?.(event);
      if (event.keyCode === 13 && onSearch) {
        onSearch();
      }
    },
    [onSearch, onKeyUp],
  );

  return <Input {...props} suffix={renderSearchIcon} onKeyUp={handleKeyUp} />;
}

export default memo(Search);
