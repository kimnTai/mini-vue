import { computed } from "@/reactive/computed";
import { effect } from "@/reactive/effect";
import { reactive } from "@/reactive/reactive";
import { describe, expect, it } from "vitest";

describe("reactive", () => {
    it("happy path", () => {
        const state = reactive({ a: "a", b: "b" });
        const name = computed(() => {
            return state.a + state.b;
        });
        let value = null;
        effect(() => {
            value = name.value;
        });
        expect(value).toBe("ab");
        state.a = "aa";
        expect(name.value).toBe("aab");
        expect(value).toBe("aab");
    });
});
