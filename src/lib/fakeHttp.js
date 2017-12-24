class FakeResponse {
  constructor(ok, value) {
    this.value = value;
    this.ok = ok;
  }

  json() {
    return Promise.resolve(this.value);
  }
}

export function aGoodResponse(value) {
  return Promise.resolve(new FakeResponse(true, value));
}

export function aBadResponse(value) {
  return Promise.resolve(new FakeResponse(false, value));
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
