class FakeResponse {
  constructor(ok, value, status) {
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
