// 「延遲回應快速變動的值」
// 常用在搜尋框等使用者輸入場景中，避免每次輸入都立即觸發 API 請求或重運算

// 範例：
// const [search, setSearch] = useState("");
// const debouncedSearch = useDebounce(search, 500);
// 這代表 search 每次改變時，debouncedSearch 會在 500ms 後才更新成 search 的值
// 如果 search 在這 500ms 內再次變動（例如使用者持續輸入文字），計時器會被取消並重新開始
// 可以確保在使用者停止輸入後 500ms 才送一次 request

import { useState, useEffect } from "react";

// debouncedValue：用來儲存「延遲後」的值 也就是停止delay時間後 最終的query是什麼
// value：即時輸入的query 
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // 當 value 或 delay 改變時，啟動 useEffect 
  // 使用 setTimeout，在 delay 毫秒後執行 setDebouncedValue(value) 所以當 value 每次改變時，並不會馬上更新 debouncedValue
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    
    // 取消上一次的計時器
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}