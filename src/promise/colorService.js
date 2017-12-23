import {FakeHttp} from '../lib/fakeHttp';

const http = new FakeHttp();

export class ColorService {
  getColors() {
    return http.get('/colors')
      .then(response => response.json())
  }
}