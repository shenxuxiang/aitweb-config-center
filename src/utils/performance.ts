class PerformaceMonitoring {
  // 首屏内 image 的 src 集合
  public FIRST_PAINT_IMAGE_URL_LIST: Set<string>;

  // 无用的元素标签的集合
  public INVALID_NODE_NAMES: string[];

  public intersection!: IntersectionObserver | null;

  public mutation!: MutationObserver | null;

  public performance!: PerformanceObserver | null;

  // first-contentful-paint 时间
  public fcp: number;

  // first-paint 时间。基本上与 first-contentful-paint 一致
  public fp: number;

  // first-screen-paint 时间。也就是首屏渲染的时间
  public fsp: number;

  // 性能监控是否已经销毁。
  public destroyed: boolean;

  // ajax 请求用时上报
  public xmlHttpRequestList: { [index: string]: number };

  constructor() {
    this.FIRST_PAINT_IMAGE_URL_LIST = new Set();
    this.INVALID_NODE_NAMES = ['SCRIPT', 'META', 'HEAD', 'LINK', 'STYLE', 'BR'];
    this.fcp = 0;
    this.fp = 0;
    this.fsp = 0;
    this.destroyed = false;
    this.xmlHttpRequestList = {};

    this.intersection = new IntersectionObserver(this.handleIntersectionCallback.bind(this));

    this.mutation = new MutationObserver(this.handleMutationCallback.bind(this));
    // 监听 document 下所有 DOM 节点的变化。
    this.mutation.observe(document, { subtree: true, childList: true });

    this.performance = new PerformanceObserver(this.handlePerformanceCallback.bind(this));
    // 监听各种资源加载、first-paint、first-contentful-paint 绘制的性能
    try {
      this.performance.observe({ entryTypes: ['paint', 'resource', 'largest-contentful-paint'], buffered: true });
    } catch (error) {
      console.log(error);
    }
  }

  // DOM 节点可见/隐藏的观察者
  handleIntersectionCallback(entries: any) {
    for (let i = 0; i < entries.length; i++) {
      const { target, time, intersectionRatio } = entries[i];
      if (intersectionRatio > 0) {
        this.intersection?.unobserve(target);
        this.fsp = Math.max(this.fsp, time);
        const imageSrc = target.nodeName === 'IMG' ? (target as HTMLImageElement).src : undefined;
        if (imageSrc) this.FIRST_PAINT_IMAGE_URL_LIST.add(imageSrc);
      }
    }
  }

  // 将目标元素添加到 intersection 观察者对象
  // 对于 image 元素，需要手动将 img 标签添加 intersection 观察者对象中。
  handlePushToIntersectionObserver(element: Element) {
    // eslint-disable-next-line
    if (this.intersection == null) return;
    this.intersection.observe(element);
  }

  // 将目标元素从 intersection 观察者对象中移除
  handleIntersectionUnObserver(element: Element) {
    // eslint-disable-next-line
    if (this.intersection == null) return;
    this.intersection?.unobserve(element);
  }

  // DOM 节点发生变化的观察者
  handleMutationCallback(records: any) {
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      // 表示新增的 DOM 节点集合
      const addedNodes = record?.addedNodes ?? [];

      for (let j = 0; j < addedNodes.length; j++) {
        const addedNode: Element = addedNodes[j];
        // 必须是一个可见的 DOM 元素节点
        if (!addedNode || addedNode.nodeType !== 1 || this.INVALID_NODE_NAMES.includes(addedNode.nodeName)) continue;
        this.handlePushToIntersectionObserver(addedNode);
      }
    }
  }

  handlePerformanceCallback(entryList: any) {
    const largestContentfulPaints = entryList.getEntriesByType('largest-contentful-paint');
    for (let i = 0; i < largestContentfulPaints.length; i++) {
      const largestContentfulPaint = largestContentfulPaints[i];
      this.fsp = Math.max(largestContentfulPaint.renderTime, this.fsp);
    }
    // 查询 fp 的最大值
    const firstPaints = entryList.getEntriesByName('first-paint');
    for (let i = 0; i < firstPaints.length; i++) {
      const firstPaint = firstPaints[i];
      if (firstPaint) {
        this.fp = Math.max(firstPaint.startTime, this.fp);
      }
    }

    // 查询 fcp 的最大值
    const firstContentfulPaints = entryList.getEntriesByName('first-contentful-paint');
    for (let i = 0; i < firstContentfulPaints.length; i++) {
      const firstContentfulPaint = firstContentfulPaints[i];
      if (firstContentfulPaint) {
        this.fcp = Math.max(firstContentfulPaint.startTime, this.fcp);
      }
    }

    const resourceList = entryList.getEntriesByType('resource');
    for (let i = 0; i < resourceList.length; i++) {
      const resource = resourceList[i];
      const { responseEnd, duration, name, initiatorType } = resource;
      if (initiatorType === 'xmlhttprequest') {
        this.xmlHttpRequestList[name] = duration;
        continue;
      }
      if (this.FIRST_PAINT_IMAGE_URL_LIST.has(name)) {
        this.fsp = Math.max(this.fsp, responseEnd);
      }
    }
  }

  // 销毁监听
  destroy() {
    this.destroyed = true;
    this.intersection?.disconnect();
    this.mutation?.disconnect();
    this.performance?.disconnect();
    this.intersection = null;
    this.mutation = null;
    this.performance = null;
    this.fp = 0;
    this.fcp = 0;
    this.fsp = 0;
    this.FIRST_PAINT_IMAGE_URL_LIST = new Set();
  }

  // 性能上报
  performanceReport() {
    if (this.destroyed) return;
    console.log(`fp: ${this.fp}`);
    console.log(`fcp: ${this.fcp}`);
    console.log(`fsp: ${this.fsp}`);
    console.log(this.xmlHttpRequestList);
    this.destroy();
  }
}

const performaceMonitoring = new PerformaceMonitoring();
export default performaceMonitoring;

function handle() {
  performaceMonitoring.performanceReport();
  window.removeEventListener('scroll', handle, false);
}

window.addEventListener('scroll', handle, false);
