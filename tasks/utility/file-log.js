import { colors } from './colors';
import { ucfirst } from './string-convert';

/**
 * @param {string} status
 */
const _getStatus = (status) => {
  const { green, blue, red, yellow, magenta } = colors;
  return ({
    create: { ico: '=', color: green },
    add   : { ico: '+', color: blue },
    unlink: { ico: '-', color: red },
    change: { ico: '*', color: yellow },
    move  : { ico: '/', color: magenta },
  })[status];
};

/**
 * @param {string} status
 * @param {string} path
 */
export const fileLog = (status, path) => {
  const { black, reset } = colors;
  const { ico, color } = _getStatus(status);
  const _msg = `  ${ color + ico } ${ ucfirst(status) + reset } ${ black }->${ reset } ${ path }`;

  console.log(_msg);
};
