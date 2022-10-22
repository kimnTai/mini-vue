import { expect, it, describe } from "vitest";
import { effect } from "@/reactive/effect";
import { reactive } from "@/reactive/reactive";

it("測試", () => {
    expect(1 + 1).toBe(2);
});

describe("effect", () => {
    it("happy path", () => {
        const user = reactive({ age: 10 });
        let nextAge = 0;
        effect(() => {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(11);
        user.age++;
        expect(nextAge).toBe(12);
    });
});
