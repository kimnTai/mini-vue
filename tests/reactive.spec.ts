import { reactive } from "@/reactive/reactive";
import { describe, expect, it } from "vitest";

describe("reactive", () => {
    it("happy path", () => {
        const original = { age: 1 };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        expect(observed.age).toBe(original.age);
    });
});
