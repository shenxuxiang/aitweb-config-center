import React, { memo, useCallback, useLayoutEffect, useRef } from 'react';
import UploadItem, { UploadStatus } from './UploadItem';
import './index.less';
import { createKey } from '@/utils';
import useReducer from '@/utils/useReducer';
import Modal from '@/components/Modal';

type FileListProps = Array<{ status: UploadStatus; url: string; uid: string }>;

interface UploadProps {
  action: string;
  value: FileListProps;
  onChange: (fileList: FileListProps) => void;
  maxLength?: number;
  maxSize?: number;
}

const initialState = {
  fileListMap: [] as FileListProps,
  showPreviewImageModal: false,
  previewImage: '',
};
const MAX_SIZE = 1024 * 1024 * 2;

function Upload(props: UploadProps) {
  const { action, value, onChange, maxLength = 1, maxSize = MAX_SIZE } = props;
  const [state, setState] = useReducer(initialState);
  const { fileListMap, showPreviewImageModal, previewImage } = state;
  const hasInnerModify = useRef(false);

  useLayoutEffect(() => {
    if (hasInnerModify.current) {
      hasInnerModify.current = false;
    } else {
      let fileListMap = [] as FileListProps;
      if (value.length >= maxLength) {
        fileListMap = [...value];
      } else {
        fileListMap = value.concat({ url: '', status: '', uid: createKey() });
      }
      setState({ fileListMap });
    }
  }, [value]);

  const handleLoadSuccess = useCallback((opts: any) => {
    setState((prevState) => {
      const index = prevState.fileListMap.findIndex((item) => item.uid === opts.uid);
      if (~index) {
        const nextFileListMap = [...prevState.fileListMap];
        nextFileListMap[index].url = opts.url;
        nextFileListMap[index].status = opts.status;

        hasInnerModify.current = true;

        // 最后一个上传文件如果是空态的话，就将其过滤掉，再透传给外层。
        if (onChange) {
          const lastIndex = nextFileListMap.length - 1;
          onChange(nextFileListMap[lastIndex]?.status === '' ? nextFileListMap.slice(0, -1) : nextFileListMap);
        }

        return { fileListMap: nextFileListMap };
      }
      return null;
    });
  }, []);

  const handleLoadStart = useCallback(() => {
    setState((prevState) => {
      if (prevState.fileListMap.length >= maxLength) return null;
      const nextFileListMap = prevState.fileListMap.concat({ url: '', status: '', uid: createKey() });
      return { fileListMap: nextFileListMap };
    });
  }, []);

  const handleDelete = useCallback((uid: any) => {
    setState((prevState) => {
      const nextFileListMap = prevState.fileListMap.filter((item) => item.uid !== uid);
      // lastIndex 表示最后一个文件
      const lastIndex = nextFileListMap.length - 1;
      hasInnerModify.current = true;
      if (onChange) {
        let value = [...nextFileListMap];
        if (lastIndex < 0) {
          value = [];
        } else if (value[lastIndex].status === '') {
          value.length = lastIndex;
        }
        onChange(value);
      }

      // lastIndex 小于 0 说明把所有文件都删除了
      // 如果最后一个文件的 status 不是空的，则说明这个是这个文件正处于 uploading、done 或 error。所以此时需要再添加一个空态的文件上传按钮用于上传文件。
      if (lastIndex < 0 || nextFileListMap[lastIndex]?.status !== '')
        nextFileListMap.push({ url: '', status: '', uid: createKey() });
      return { fileListMap: nextFileListMap };
    });
  }, []);

  const previewImgSrc = useCallback((img: string) => {
    setState({ showPreviewImageModal: true, previewImage: img });
  }, []);

  return (
    <div className="ait-upload">
      {fileListMap?.map((item) => (
        <UploadItem
          action={action}
          url={item.url}
          status={item.status}
          uid={item.uid}
          key={item.uid}
          maxSize={maxSize}
          onLoadSuccess={handleLoadSuccess}
          onLoadStart={handleLoadStart}
          onDelete={handleDelete}
          onPreviewImage={previewImgSrc}
        />
      ))}
      <Modal
        title={null}
        visible={showPreviewImageModal}
        closable={false}
        foot={false}
        onCancel={() => setState({ showPreviewImageModal: false })}
      >
        <div>{previewImage ? <img src={previewImage} alt="图片预览" style={{ width: '100%' }} /> : null}</div>
      </Modal>
    </div>
  );
}

export default memo(Upload);
