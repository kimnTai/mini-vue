let currentEffect: Function | null = null;

export class Dep {
    effects: Set<Function> = new Set();
    get value() {
        this.depend();
        return this._value;
    }
    set value(val) {
        this._value = val;
        this.notice();
    }
    constructor(private _value: any) {}

    depend(): void {
        if (currentEffect) {
            this.effects.add(currentEffect);
        }
    }
    notice() {
        this.effects.forEach((effect) => {
            effect();
        });
    }
}

export function effectWatch(fn: Function) {
    currentEffect = fn;
    fn();
    currentEffect = null;
}
