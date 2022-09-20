import React, { memo, useRef, useLayoutEffect } from 'react';
import useReducer from '@/utils/useReducer';
import ProgressAnimation from './ProgressAnimation';
import message from '@/components/Message';
import send from './send';
import Icon from '@/components/Icon';
import Popover from '@/components/Popover';

export type UploadStatus = 'done' | 'uploading' | 'error' | '';
interface OnLoadSuccessParamates {
  status: UploadStatus;
  url: string;
  uid: string;
}
interface UploadItemProps {
  action: string;
  status: UploadStatus;
  url: string;
  uid: string;
  onLoadSuccess: (opts: OnLoadSuccessParamates) => void;
  onLoadStart: () => void;
  onDelete: (uid: string) => void;
  onPreviewImage: (img: string) => void;
  maxSize: number;
}

const initialState = {
  status: '' as UploadStatus,
  previewImgSrc: '',
  showImage: false,
  showCanvas: true,
};
const popoverBodyStyle = { padding: '10px' };

function UploadItem(props: UploadItemProps) {
  const { action, onLoadSuccess, uid, onLoadStart, onDelete, onPreviewImage, maxSize } = props;
  const cvsRef = useRef<any>(null);
  const uploadAnimationRef = useRef<any>(null);
  const [state, setState] = useReducer(initialState);
  const { status, previewImgSrc, showImage, showCanvas } = state;
  const hasInnerModify = useRef(false);

  useLayoutEffect(() => {
    if (hasInnerModify.current) {
      hasInnerModify.current = false;
    } else {
      setState((prevState) => ({
        status: props.status,
        showImage: !!props.status,
        showCanvas: !props.status,
        previewImgSrc: prevState.previewImgSrc ? prevState.previewImgSrc : props.url,
      }));
    }
  }, [props.status, props.url]);

  useLayoutEffect(() => {
    // 文件上传动画进行初始化
    uploadAnimationRef.current = new ProgressAnimation(cvsRef.current.getContext('2d'), null, () =>
      setState({ showCanvas: false }),
    );
    return () => {
      uploadAnimationRef.current = null;
    };
  }, []);

  const handleProgress = (progress: number) => {
    if (progress === 100) setState({ showImage: true });
    uploadAnimationRef.current?.updateProgress(progress);
  };

  const handleLoadStart = () => {
    uploadAnimationRef.current?.start();
    setState({ status: 'uploading' });
    onLoadStart?.();
  };

  const handleFileChange = (event: any) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file.size >= maxSize) {
      message.warn('文件内容大于2m，无法上传');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setState({ previewImgSrc: window.URL.createObjectURL(file) });

    send(action, 'POST', formData, handleLoadStart, handleProgress)
      .then((response) => {
        const { data, code } = response;
        if (code === 0) {
          hasInnerModify.current = true;
          setState({ status: 'done' });
          onLoadSuccess?.({ status: 'done', url: data, uid });
        }
      })
      .catch((error) => {
        hasInnerModify.current = true;
        setState({ status: 'error', showCanvas: false });
        onLoadSuccess?.({ status: 'error', url: '', uid });
        message.error(error.message);
      });
  };

  return (
    <div className="ait-upload-item" style={{ borderColor: status === 'error' ? '#f5222d' : '' }}>
      <Popover content="上传失败" trigger="hover" style={popoverBodyStyle} disabled={status !== 'error'}>
        <div className="ait-upload-view">
          {previewImgSrc && (
            <img
              alt="图片预览"
              src={previewImgSrc}
              className="ait-upload-view-image"
              style={{ display: showImage ? '' : 'none' }}
              onClick={() => onPreviewImage(previewImgSrc)}
            />
          )}
          <div className="ait-upload-delete-button" onClick={() => onDelete(uid)}>
            <Icon name="close" className="ait-upload-delete-icon" />
          </div>
        </div>
      </Popover>
      <canvas
        width="100"
        height="100"
        className="ait-upload-canvas"
        style={{ display: showCanvas ? '' : 'none' }}
        ref={cvsRef}
      />
      <label className="ait-upload-label" style={{ display: status ? 'none' : '' }}>
        <input type="file" hidden onChange={handleFileChange} />
        <span className="ait-upload-label-icon" />
        <span className="ait-upload-label-text">上传文件</span>
      </label>
    </div>
  );
}

export default memo(UploadItem);
