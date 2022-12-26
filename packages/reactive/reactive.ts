import { mutableHandlers, ReactiveFlags } from "./baseHandlers";

// 儲存響應式物件
const reactiveMap = new WeakMap();

export function reactive<T extends Object>(obj: T): T {
    // 如果目標是一個代理物件，那就一定被代理過了
    if ((<any>obj)[ReactiveFlags.IS_REACTIVE]) {
        return obj;
    }
    // 如果已存在，返回該物件
    const existingProxy = reactiveMap.get(obj);
    if (existingProxy) {
        return existingProxy;
    }
    // 第一個普通物件代理，new Proxy 代理一次
    const proxy = new Proxy<T>(obj, mutableHandlers);
    reactiveMap.set(obj, proxy);
    return proxy;
}

export function toReactive(value: any) {
    if (typeof value === "object") {
        return reactive(value);
    }
    return value;
}
