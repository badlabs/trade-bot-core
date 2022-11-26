import {globalStore} from "../../global/store";

export function HandleError(){
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Check of the decorated property is a function
        if (typeof descriptor.value === 'function') {
            // The function that we are going to wrap
            const declaredFn = descriptor.value
            // Provide a new function for this property that wraps the original function
            descriptor.value = function (...args: any[]) {
                // Call the method with `this` set the object with the method,
                // in case that matters.
                const result = declaredFn.apply(this, args)

                // Do the thing you want with the result

                if (result instanceof Promise){
                    result.catch(e => {
                        globalStore.logger?.log({
                            type: 'error',
                            message: `Error occurred in '${propertyKey}`,
                            attachment: e
                        })
                    })
                }

                // Return the result from the origin function
                return result
            }
        } else
            throw new Error(`HandleError decorator is applicable only to functions. `+
                `Please remove it from '${propertyKey}' in ${target}`)
    };
}