const resizeCallbacks = new WeakMap();


// defined outside of action, so we only create a single instance
let resizeObserver;
let tid;


const handleResize = (entries) => {
  clearTimeout(tid);
  for (const entry of entries) {
    const callback = resizeCallbacks.get(entry.target);
    if (callback) {
      const {width, height} = entry.contentRect;
      callback({height, width, entry});
    }
  }
};

const throttleResize = (entries) => {
  clearTimeout(tid);
  tid = setTimeout(() => handleResize(entries), 100);
};

export const observeResize = (node, callback) => {

  resizeObserver = resizeObserver || new ResizeObserver(throttleResize);
  resizeCallbacks.set(node, callback);
  resizeObserver.observe(node);

  return {
    destroy() {
      resizeObserver.unobserve(node);
      resizeCallbacks.delete(node);
    }
  };
};
