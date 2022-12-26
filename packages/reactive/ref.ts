import { isTracking, trackEffects, triggerEffects } from "./effect";
import { toReactive } from "./reactive";

export default function ref(value: any) {
    return createRef(value);
}
function createRef(value: any) {
    return new RefImpl(value);
}

class RefImpl {
    public dep = new Set();
    public __v_isRef = true;
    public _value;
    get value() {
        if (isTracking()) {
            trackEffects(this.dep);
        }
        return this._value;
    }
    set value(newValue) {
        // 先看一下之前之後是否一樣
        if (newValue !== this._rawValue) {
            this._rawValue = newValue;
            this._value = toReactive(newValue);
            triggerEffects(this.dep);
        }
    }
    // 原來的值
    constructor(public _rawValue: any) {
        // _rawValue 如果用戶傳進來的值，是一個物件，我需要將物件轉化為響應式
        this._value = toReactive(_rawValue);
    }
}
