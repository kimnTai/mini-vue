import { track, trigger } from "./effect";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        track(target, "get", key);
        return Reflect.get(target, key, receiver);
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
