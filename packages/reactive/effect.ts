export let activeEffect: ReactiveEffect | undefined = undefined;

function cleanupEffect(effect: ReactiveEffect) {
    effect.deps.forEach((set) => set.delete(effect));
    effect.deps.length = 0;
}

class ReactiveEffect {
    parent = undefined;
    deps: Set<ReactiveEffect>[] = [];
    // 默認是激活狀態
    active = true;
    constructor(public fn: () => void) {}

    // 執行 effect
    run(): void {
        // 非激活的情況，只需要執行函數，不需要進行依賴收集
        if (!this.active) {
            this.fn();
        }
        // 進行依賴收集，核心就是將當前的 effect 和屬性關聯再一起
        try {
            this.parent = activeEffect as any;
            activeEffect = this;

            // 這裡我們需要在執行用戶函數之前，將之前收集的內容清空 activeEffect.deps = [(Set),(Set)]
            cleanupEffect(this);
            return this.fn();
        } finally {
            activeEffect = this.parent;
        }
    }
    stop() {
        if (this.active) {
            this.active = false;
            // 停止effect的收集
            cleanupEffect(this);
        }
    }
}

export function effect(fn: () => void): () => void {
    // fn 可以根據狀態變化重新執行，effect 可以嵌套著寫
    const _effect = new ReactiveEffect(fn);
    // 默認先執行一次
    _effect.run();
    // 綁定this執行
    const runner = _effect.run.bind(_effect);
    // 將effect掛載到runner函數上
    (<any>runner).effect = _effect;
    return runner;
}

/**
 * 多對多，一個 effect 對應多個屬性，一個屬性對應多個 effect
 * 單向，屬性紀錄了 effect,應該讓 effect 也記錄他那些屬性收集過，這樣做是為了可以清理
 * 物件，某個屬性 -> 多個 effect
 * WeakMap = {物件:Map{name:Set}}
 */
const targetMap = new WeakMap();
export function track(target: any, type: "get", key: string | symbol) {
    if (!activeEffect) return;

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }

    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }

    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        //存放的是屬性對應的 Set，讓 effect 記錄住對應的 dep,清理的時候會用到
        activeEffect.deps.push(dep);
    }
}
export function trigger(target: any, type: "set", key: string | symbol) {
    const depsMap = targetMap.get(target);
    // 觸發的值不在模板中使用
    if (!depsMap) {
        return;
    }
    const effects = depsMap.get(key);
    if (!effects) {
        return;
    }
    // 永遠在執行之前，先拷貝一份來執行，不要關聯引用
    [...effects].forEach((item: ReactiveEffect) => {
        // 我們在執行 effect的時候又要執行自己，需要屏蔽，不要無限調用
        if (item === activeEffect) {
            return;
        }
        item.run();
    });
}
