import { effect } from "@/reactive/effect";
import { reactive } from "@/reactive/reactive";

const data = { name: "kim", age: 13 };
const state = reactive(data);

effect(() => {
    const dom = document.querySelector("body");
    if (!dom) return;
    dom.innerText = `${state.name}今年${state.age}歲`;
});

setTimeout(() => {
    state.age = 14;
}, 1000);
