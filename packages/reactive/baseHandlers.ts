import { track, trigger } from "./effect";
import { reactive } from "./reactive";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        track(target, "get", key);
        const res = Reflect.get(target, key, receiver);
        if (res instanceof Object) {
            // 深度代理實現，性能好 取值就可以代理
            return reactive(res);
        }
        return res;
    },
    set(target, key, value, receiver) {
        const oldValue = target[key];
        const result = Reflect.set(target, key, value, receiver);
        // 值變化了，要更新
        if (oldValue !== value) {
            trigger(target, "set", key);
        }
        return result;
    },
};
