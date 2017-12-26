const parseJson = response => response.json();

export class ColorService {
  getColors() {
    return fetch('/colors');
  }

  makeColorCooler(color) {
    return fetch(`/colors/${color}`, {
      body: JSON.stringify({change: 'make it more cool'})
    });
  }

  createColor(color) {
    const createColor = () => fetch('/colors', {
      body: JSON.stringify({
        color: {
          name: color
        }
      })
    });
    const error = () => Promise.reject(new Error(color + ' already exists'));

    return this.getColors()
      .then(parseJson)
      .then(responseBody  => responseBody.colors.includes(color))
      .then(colorExists   => colorExists ? error() : createColor())
  }

  makeAllColorsCooler() {
    return this.getColors()
      .then(parseJson)
      .then(responseBody  => responseBody.colors)
      .then(colors        => Promise.all(colors.map(this.makeColorCooler)))
      .then(responses     => Promise.all(responses.map(parseJson)))
  }
}