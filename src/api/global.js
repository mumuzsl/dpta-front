export function poll(fun) {
    return setInterval(fun, 10 * 1000)
}