export function isType(data: any): string {
  return Object.prototype.toString.call(data).slice(8, -1);
}

export function isArray(data: any): data is any[] {
  return isType(data) === 'Array';
}

export function isMap(data: any): data is Map<any, any> {
  return isType(data) === 'Map';
}

export function isSet(data: any): data is Set<any> {
  return isType(data) === 'Set';
}

export function isObject(data: any): data is Object {
  return isType(data) === 'Object';
}

export function isEmpty(data: any): data is null | undefined {
  if (!data) return true;
  if (isArray(data)) return data.length <= 0;
  if (isMap(data) || isSet(data)) return data.size <= 0;
  if (isObject(data)) return Object.keys(data).length <= 0;
  return false;
}

export function getViewPortWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export function getViewPortHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

export function getScrollTop(container: Window | HTMLElement) {
  if (container === window) {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  }
  return (container as HTMLElement).scrollTop | 0;
}

export function getScrollHeight(container: Window | HTMLElement) {
  if (container === window) {
    return document.documentElement.scrollHeight || document.body.scrollHeight;
  }
  return (container as HTMLElement).scrollHeight | 0;
}
// targetNodeClassName 目标节点的 className
// currentNode 当前节点
export function hasContainsTargetNode(targetNodeClassName: string, currentNode: HTMLElement) {
  let parent = currentNode.parentNode;
  while (parent && parent !== document && parent !== document.body) {
    if ((parent as HTMLElement).classList.contains(targetNodeClassName)) return false;
    parent = parent.parentNode;
  }
  return true;
}

export let requestAnimationFrame: (cb: FrameRequestCallback) => number = (callback: FrameRequestCallback) => {
  if ('requestAnimationFrame' in window) {
    requestAnimationFrame = window.requestAnimationFrame;
  } else if ('webkitRequestAnimationFrame' in window) {
    requestAnimationFrame = (window as any).webkitRequestAnimationFrame;
  } else if ('mozRequestAnimationFrame' in window) {
    requestAnimationFrame = (window as any).mozRequestAnimationFrame;
  } else if ('msRequestAnimationFrame' in window) {
    requestAnimationFrame = (window as any).msRequestAnimationFrame;
  } else {
    // 表示上一次计时器回调函数执行结束的时间戳。
    let lastTime = Date.now();
    requestAnimationFrame = function (callback: FrameRequestCallback) {
      const currentTime = Date.now();
      const delay = Math.max(0, 17 - (currentTime - lastTime));

      const interval = window.setTimeout(() => {
        callback(interval);
      }, delay);

      // 当前计时器回调函数执行结束时的时间戳。用于下一次计时器延迟时间计算。
      lastTime = currentTime + delay;
      return interval;
    };
  }

  return requestAnimationFrame(callback);
};

export let cancelAnimationFrame: (idx: number) => void = (idx: number) => {
  if ('requestAnimationFrame' in window) {
    cancelAnimationFrame = window.cancelAnimationFrame;
  } else if ('mozCancelAnimationFrame' in window) {
    cancelAnimationFrame = (window as any).mozCancelAnimationFrame;
  } else {
    cancelAnimationFrame = function (idx: number) {
      clearTimeout(idx);
    };
  }
  cancelAnimationFrame(idx);
};

// immediately 表示是否立即执行
export function throttle(fn: Function, delay: number, immediately = false) {
  let interval: number | null = null;
  return function (...args: any[]) {
    if (immediately) {
      if (interval !== null) return;

      fn(...args);
      interval = window.setTimeout(() => (interval = null), delay);
    } else {
      if (interval !== null) return;

      interval = window.setTimeout(() => {
        fn(...args);
        interval = null;
      }, delay);
    }
  };
}

// immediately 表示是否立即执行
export function debounce(fn: Function, delay: number, immediately = false) {
  let interval: number | null = null;
  return function (...args: any[]) {
    if (immediately) {
      // eslint-disable-next-line
      if (interval == null) fn(...args);
      clearTimeout(interval!);
      interval = window.setTimeout(() => (interval = null), delay);
    } else {
      clearTimeout(interval!);
      interval = window.setTimeout(() => {
        fn(...args);
        interval = null;
      }, delay);
    }
  };
}

export function createKey(int?: number) {
  return Math.random()
    .toString(int || 32)
    .slice(2);
}

export function getCssPropertyValue(target: Element, propertyName: string) {
  return window.getComputedStyle(target, null).getPropertyValue(propertyName);
}


export function getPattern(name: string) {
  let source = '(?:^|;\\s*)';
  source += name.replace(/[\[\](){}\\/|^$+-?#\s]/, '\\$&');
  source += '=([^;]+)';
  return new RegExp(source);
}
