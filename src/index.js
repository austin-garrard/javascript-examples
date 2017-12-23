import {ColorService} from './promise/one';
console.log('hi');

new ColorService().getColors().then(response => console.log(response));