import {ColorService} from './promise/colorService';
console.log('hi');

new ColorService().getColors().then(response => console.log(response));