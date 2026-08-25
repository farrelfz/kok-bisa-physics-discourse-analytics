
import { useState, useEffect, useRef } from 'react';

export function useCounter(target, duration=1600) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!target || started.current) return;
    started.current = true;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(target * ease));
      if (p < 1) requestAnimationFrame(frame);
      else setVal(target);
    }
    requestAnimationFrame(frame);
  }, [target, duration]);

  return val;
}
