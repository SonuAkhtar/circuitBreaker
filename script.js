const CircuitBreaker = (fun, failCount, timeThreshold) => {
  let fails = 0;
  let lastFailTime = 0;
  let shouldClose = false;

  return (...args) => {
    if (shouldClose) {
      const diff = Date.now() - lastFailTime;

      if (diff > timeThreshold) shouldClose = false;
      else return console.error("Service unavailable");
    }

    try {
      const result = fun(...args);
      fails = 0;
      return result;
    } catch (error) {
      fails++;
      lastFailTime = Date.now();
      shouldClose = fails >= failCount;

      console.log("Error in execution");
    }
  };
};

const testFunction = () => {
  let count = 0;

  return function () {
    count++;
    if (count < 4) throw "Failed";
    else return "Success";
  };
};

const tst = testFunction();
const cb = CircuitBreaker(tst, 3, 400);

cb();
cb();
cb();
cb();
cb();

setTimeout(() => {
  console.log(cb());
}, 1000);
