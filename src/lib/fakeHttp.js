
class FakeResponse {
  constructor(value) {
    this.value = value;
  }

  json() {
    return Promise.resolve(this.value);
  }
}

export class FakeHttp {

  constructor() {
    this.responses = {
      '/colors': {
        colors: ['red', 'green', 'blue', 'purple']
      }
    }
  }

  get(url) {
    let response = new FakeResponse(this.responses[url]);
    return Promise.resolve(response);
  }
}