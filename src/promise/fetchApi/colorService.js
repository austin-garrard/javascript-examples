import {http} from './fakeHttp'

const parseJson = response => response.json();

export class ColorService {
  getColors() {
    return http.get('/colors');
  }

  makeColorCooler(color) {
    return http.post(`/colors/${color}`, {
      change: 'make it more cool'
    });
  }

  createColor(color) {
    const createColor = () => http.post('/colors', {
      color: {
        name: color
      }
    });
    const error = () => new Error(color + 'already exists');

    return this.getColors()
      .then(parseJson)
      .then(responseBody => responseBody.colors.includes(color))
      .then(colorExists => colorExists ? error() : createColor())
  }

  makeAllColorsCooler() {
    return this.getColors()
      .then(parseJson)
      .then(responseBody  => responseBody.colors)
      .then(colors        => Promise.all(colors.map(this.makeColorCooler)))
      .then(responses     => Promise.all(responses.map(parseJson)))
  }
}