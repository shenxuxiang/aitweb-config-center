import message from '@/components/Message';
export type HttpMethod = 'GET' | 'POST' | 'HEAD' | 'PUT';
export interface HttpResponse {
  data: any,
  authorToken: string,
  code: number,
  msg: string,
}

export function send(url: string, method: HttpMethod, query: any): Promise<HttpResponse> {
  return new Promise<HttpResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.ontimeout = function () {
      return reject(new Error('请求超时'));
    };
    xhr.onerror = function () {
      return reject(new Error('请求失败，请稍后重试！'));
    };
    console.log(window.localStorage.getItem('authorToken'), 'get');
    xhr.setRequestHeader('authorization', window.localStorage.getItem('authorToken') || '')
    const body = method === 'GET' || method === 'HEAD' ? null : query;
    if (body instanceof FormData) {
      xhr.send(body);
    } else {
      xhr.send(JSON.stringify(body));
    }
  });
}

export default function request(url: string, method: HttpMethod, query: any) {

  return send(url, method, query)
    .then((response: HttpResponse) => {
      const { code, msg } = response;
      if (code === 0) {
        window.localStorage.setItem('authorToken', response.authorToken);
        return response;
      } else if (code === 1999) {
        let path = window.location.hash.slice(1);
        path = encodeURIComponent(path);
        window.location.href = '/#/login?redirect=' + path;
        throw new Error('用户未登录');
      }
      throw new Error(msg);
    })
    .catch((error) => {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error(error);
      }
      return Promise.reject(error);
    });
}

request.post = function (url: string, query: any) {
  return request(url, 'POST', query);
};
request.get = function (url: string) {
  return request(url, 'GET', null);
};
