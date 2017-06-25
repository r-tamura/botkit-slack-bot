const entries = require('object.entries')
const R = require('ramda')

const TASK_REGEXP = /\[task\]|\[end\]/

const isTask = text => TASK_REGEXP.test(text)

const filterTasks = (messages) =>
    messages.filter(({text}) => isTask(text))
exports.filterTasks = filterTasks

const sortTasks = (tasks) =>
  tasks.sort(({ts: ts1}, {ts: ts2}) => ts1 - ts2)
exports.sortTasks = sortTasks

function sum(messages, timeConveror = s => s) {
    const res = {}
    for(let i=0; i < messages.length - 1; i+=1) {
        const text = messages[i].text.match(/^\[task\](.*)/i)[1].trim()
        const ts = messages[i].ts
        const nextTs = messages[i+1].ts

        const diff = Math.round(nextTs - ts)
        if (text in res) {
            res[text] += diff
        } else {
            res[text] = diff
        }
    }
    return entries(res).map(([key, value]) => ({name: key, time: timeConveror(value)}))
}
exports.sum = sum

const padString = (targetLength, padChar, str) =>
    `${padChar.repeat(targetLength)}${str}`.slice(-targetLength)

const secondToObject = sec => {
    const hour = Math.floor(sec / 3600)
    const minute = Math.floor(sec % 3600 / 60)
    const second = sec % 3600 % 60
    const padStringwith2Zeros = R.curry(padString)(2, "0")
    return {
        hour: padStringwith2Zeros(hour),
        minute: padStringwith2Zeros(minute),
        second: padStringwith2Zeros(second)
    }
}

const aggregate = R.compose(
    R.curryN(2, sum)(R.__, secondToObject),
    sortTasks,
    filterTasks
)
exports.aggregate = aggregate
