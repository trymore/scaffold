import { colors } from './colors';

export default class TaskLog {

  constructor(taskName) {
    this._taskName  = taskName;
    this._startTime = 0;
  }

  start() {
    const { _taskName } = this;
    const { black, cyan, reset } = colors;

    const _date     = new Date();
    const _time     = this._getTime(_date);
    this._startTime = _date.getTime();

    const _msg = `[${ black + _time + reset }] Starting '${ cyan + _taskName + reset }'...`;

    console.log(_msg);
  }

  finish() {
    const { _taskName, _startTime } = this;
    const { black, magenta, cyan, reset } = colors;

    const _date       = new Date();
    const _time       = this._getTime(_date);
    const _finishTime = _date.getTime() - _startTime;

    const _msg = `[${ black + _time + reset }] Finished '${ cyan + _taskName + reset }' after ${ magenta + _finishTime } ms ${ reset }`;

    console.log(_msg);
  }

  /**
   * @param {number} date
   */
  _getTime(date) {
    return `${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }`;
  }

}
