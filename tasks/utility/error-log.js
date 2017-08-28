import { colors } from './colors';

/**
 * @param {string} task
 * @param {string} str
 */
export const errorLog = (task, str) => {
  const { reset, black, red } = colors;
  const _msg = `${ red }**************************************
'${ task }' Error:

${ reset + str }
${ red }**************************************${ reset }`;

  console.log(_msg);
};
