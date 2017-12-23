import {FakeHttp} from '../lib/fakeHttp';

export class ColorService {

  constructor() {
    this.http = new FakeHttp();
  }

  getColors() {
    return this.http.get('/colors')
      .then(response => response.json())
  }
}