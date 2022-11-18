export function deepCopy<T = unknown>(object: T){
    return JSON.parse(JSON.stringify(object)) as T
}