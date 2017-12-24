import {http} from './fakeHttp'

export class ColorService {
  getColors() {
    return http.get('/colors');
  }

  makeColorCooler(color) {
    return http.post(`/colors/${color}`, {
      change: 'make it more cool'
    });
  }

  makeAllColorsCooler() {
    const parseJson = response => response.json();
    return this.getColors()
      .then(parseJson)
      .then(responseBody  => responseBody.colors)
      .then(colors        => Promise.all(colors.map(this.makeColorCooler)))
      .then(responses     => Promise.all(responses.map(parseJson)))
  }
}