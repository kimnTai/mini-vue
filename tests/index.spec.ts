import { expect, it, describe } from "vitest";
import { effect } from "@/reactive/effect";
import { reactive } from "@/reactive/reactive";

describe("effect", () => {
    it("實現 effect 基本函數", () => {
        const user = reactive({ age: 10 });
        let value = 0;
        effect(() => (value = user.age + 1));
        expect(value).toBe(11);
        // 數據變化，更新 value
        user.age++;
        expect(value).toBe(12);
    });
    it("分支切換", () => {
        const state = reactive({ flag: true, name: 1, age: 0 });
        let value = 0;
        effect(() => {
            state.flag ? state.name : state.age;
            value++;
        });
        expect(value).toBe(1);
        // 更新依賴 -> 只收集 age
        state.flag = false;
        expect(value).toBe(2);
        // 修改 name，原則上不更新
        state.name = 22;
        expect(value).toBe(2);
    });
    it("stop 函數", () => {
        const state = reactive({ age: 1 });
        let value = 0;
        const runner: any = effect(() => {
            value = state.age;
        });
        // 停止更新
        runner.effect.stop();
        state.age = 2;
        expect(value).toBe(1);
        // 強制更新
        runner();
        expect(value).toBe(2);
    });
});
