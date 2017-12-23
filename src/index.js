import {ColorService} from './lib/colorService';
console.log('hi');

new ColorService().getColors().then(response => console.log(response));