import { clock } from '../../variables/System.js';

/**
 * @link https://docs.gtk.org/glib/method.DateTime.format.html
 * @param {import('types/widgets/label').Props & {
 *   format?: string,
 *   interval?: number,
 * }} o
 */
export default ({
    format = '%H:%M:%S %B %e. %A',
    ...rest
} = {}) => Widget.Label({
    ...rest,
    label: clock.bind().as(h => h.format(format)) || 'wrong format'
});
