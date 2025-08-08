// Utility functions for the application

function getMinutesUntil(date) {
  const now = new Date();
  const difference = date.getTime() - now.getTime();
  const minutes = Math.floor(difference / 1000 / 60);
  return minutes;
}

const formatRepoString = repo => {
  repo = repo.replace('https://github.com/', '');
  repo = repo.replace('http://github.com/', '');
  repo = repo.replace('.git', '');
  return repo;
};

// Debounce utility function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility function for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance monitoring utilities
export const measureAsyncPerformance = async (name, fn) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Memory usage monitoring
export const logMemoryUsage = (label = 'Memory Usage') => {
  if (performance.memory) {
    const memory = performance.memory;
    console.log(`${label}:`, {
      used: `${Math.round(memory.usedJSHeapSize / 1048576)} MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1048576)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)} MB`
    });
  }
};

export {
  formatRepoString, 
  getMinutesUntil
};
