import { reactive } from "@/reactive/reactive";
import { describe, expect, it } from "vitest";

describe("reactive", () => {
    it("happy path", () => {
        const original = { age: 1 };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        expect(observed.age).toBe(original.age);
    });
    it("深度代理", () => {
        const original = { age: 1, address: { num: 10 } };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        expect(observed.age).toBe(original.age);
        expect(observed.address.num).toBe(original.address.num);
        expect((<any>observed.address)["__v_isReactive"]).toBe(true);
    });
});
