type HttpMethod = 'POST' | 'PUT';
interface HttpResponse {
  data: any;
  code: number;
  msg: string;
}
type OnProgress = (progress: number) => void;
type OnLoadStart = () => void;

export default function send(
  url: string,
  method: HttpMethod,
  query: any,
  onLoadStart?: OnLoadStart,
  onProgress?: OnProgress,
): Promise<HttpResponse> {
  return new Promise<HttpResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        return resolve(JSON.parse(xhr.response));
      }
      return reject(new Error(xhr.statusText));
    };
    xhr.onloadstart = function () {
      onLoadStart?.();
    };
    xhr.ontimeout = function () {
      return reject(new Error('请求超时'));
    };
    xhr.onerror = function () {
      return reject(new Error('请求失败，请稍后重试！'));
    };
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const progress = Math.ceil((event.loaded / event.total) * 100) | 0;
        onProgress?.(progress);
      }
    };
    xhr.send(query);
  });
}
