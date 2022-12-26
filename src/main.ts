import { effect } from "@/reactive/effect";
import ref from "@/reactive/ref";

const a = ref(1);
let dummy;
let calls = 0;
effect(() => {
    calls++;

    console.log(a.value);
    dummy = a.value;
});
