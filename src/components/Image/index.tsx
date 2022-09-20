import React, { memo, useLayoutEffect, useRef } from 'react';
import performanceMonitoring from '@/utils/performance';

function Image(props: any) {
  const { src, alt, style, className } = props;
  const imgRef = useRef<any>(null);

  useLayoutEffect(() => {
    performanceMonitoring.handlePushToIntersectionObserver(imgRef.current);

    return () => {
      performanceMonitoring.handleIntersectionUnObserver(imgRef.current);
    };
  }, []);

  return <img src={src} className={className} style={style} alt={alt} ref={imgRef} />;
}

export default memo(Image);
