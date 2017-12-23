class FakeResponse {
  constructor(ok, value) {
    this.value = value;
    this.ok = ok;
  }

  json() {
    return Promise.resolve(this.value);
  }
}

const responses = {
  '/colors': new FakeResponse(true, {
    colors: ['red', 'green', 'blue', 'purple']
  }),

  '/colors?badQuery=oops': new FakeResponse(false, {
    error: {
      message: 'connection error!'
    }
  }),

  '/colors/purple': new FakeResponse(false, {
    error: {
      message: 'it can\'t get more cool'
    }
  })
};

const resolveOrReject = (response, resolve) => {
  if (resolve) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response)
  }
}

class FakeHttp {

  constructor() {
    this.resolve = true;
  }

  get(url) {
    return resolveOrReject(responses[url], this.resolve);
  }

  post(url, data) {
    return resolveOrReject(responses[url], this.resolve);
  }
}

export const http = new FakeHttp();