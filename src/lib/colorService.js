import {http} from './fakeHttp'

export class ColorService {
  getColors() {
    return http.get('/colors')
      .then(response => response.json())
      .catch(error => ({ error: 'connection error' }));
  }

  changeColor(color) {
    const requestBody = {
      change: 'make it more cool'
    };

    return http.post(`/colors/${color}`, requestBody);
  }
}