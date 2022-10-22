1. 我們先搞了一個響應式對象 new Proxy
2. effect 默認數據變化要能更新，我們先將正在執行的 effect 作為全局變量，渲染(取值)，我們在 get 方法中進行依賴收集
3. weakMap (對象:map 屬性:set(effect))
4. 稍後用戶發生數據變化，會通過對象屬性來查找對應的 effect 集合，找到 effect 全部執行
