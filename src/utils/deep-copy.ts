export function deepCopy<T = unknown>(object: T){
    if (object === undefined) return object
    return JSON.parse(JSON.stringify(object)) as T
}