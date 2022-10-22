import { expect, it, describe } from "vitest";
import { effect } from "@/reactive/effect";
import { reactive } from "@/reactive/reactive";

describe("effect", () => {
    it("實現 effect 基本函數", () => {
        const user = reactive({ age: 10 });
        let nextAge = 0;
        effect(() => {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(11);
        user.age++;
        expect(nextAge).toBe(12);
    });
    it("分支切換", () => {
        const state = reactive({ flag: true, name: 1, age: 0 });
        let value = 0;
        effect(() => {
            state.flag ? state.name : state.age;
            value++;
        });
        expect(value).toBe(1);
        // 更新依賴
        state.flag = false;
        expect(value).toBe(2);
        // 修改 name，原則上不更新
        state.name = "zf";
        expect(value).toBe(2);
    });
});
