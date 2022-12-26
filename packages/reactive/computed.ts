import { isTracking, ReactiveEffect, trackEffects, triggerEffects } from "./effect";

class ComputedRefImpl {
    public effect: ReactiveEffect;
    // 默認應該取值的時間進行計算
    public _dirty = true;
    public __v_isReadonly = true;
    public __v_isRef = true;
    public _value: any;
    public dep = new Set();

    constructor(public getter: any, public setter: Function) {
        // 我們將用戶的 getter 放到 effect 中，關聯的屬性就會被這個 effect 收集起來
        this.effect = new ReactiveEffect(getter, () => {
            // 稍後依賴的屬性發生變化會執行此調度函數
            if (!this._dirty) {
                this._dirty = true;
                // 實現一個觸發更新
                triggerEffects(this.dep);
            }
        });
    }
    // 類的屬性訪問器，底層就是  Object.defineProperty
    get value() {
        if (isTracking()) {
            // 做依賴收集
            trackEffects(this.dep);
        }
        if (this._dirty) {
            this._dirty = false;
            this._value = this.effect.run();
        }
        return this._value;
    }
    set value(newValue) {
        this._value = newValue;
    }
}

export function computed(getterOrOptions: any): ComputedRefImpl {
    let getter;
    let setter;
    if (typeof getterOrOptions === "function") {
        getter = getterOrOptions;
        setter = () => {};
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter);
}
