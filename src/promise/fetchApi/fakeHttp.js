class FakeResponse {
  constructor(ok, value, status = 200) {
    this.value = value;
    this.ok = ok;
    this.status = status;
  }

  json() {
    return Promise.resolve(this.value);
  }
}

export function aGoodResponse(value, status = 200) {
  return Promise.resolve(new FakeResponse(true, value, status));
}

export function aBadResponse(value, status = 400) {
  return Promise.resolve(new FakeResponse(false, value, status));
}

export function anError(message) {
  return Promise.reject(new Error(message));
}


class FakeHttp {
  get(url) {
    throw new Error('implement or spy on me to return a promise that resolves with a response or a promise that rejects with an error');
  }

  post(url, data) {
    throw new Error('implement or spy on me to return a promise that resolves with a response or a promise that rejects with an error');
  }
}

export const http = new FakeHttp();
