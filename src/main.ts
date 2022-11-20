import { Dep, effectWatch } from "@/reactive/ref";

const a = new Dep(10);
let b = 0;

effectWatch(() => {
    b = a.value + 10;
    console.log(b);
});

a.value = 20;
