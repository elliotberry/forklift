
const dataProperties = [
  {
    prop: "stargazers_count",
    label: "Stars",
    apiTransform: (fork) => fork.stargazers_count,
  },

  {
    prop: "name",
    label: "Name",
    apiTransform: (fork) => fork.full_name,
  },
  {
    prop: "description",
    label: "Description",
    apiTransform: (fork) => fork.description,
  },
  {
    prop: "size",
    label: "Size",
    apiTransform: (fork) => fork.size,
  },
  {
    prop: "owner",
    label: "Owner",
    apiTransform: (fork) => fork.owner.login,
  },
];

const columnsOptions = dataProperties.map((prop) => {
  return {
    prop: prop.prop,
    label: prop.label,
    enabled: true,
  };
});

const originalRepoDataFormatter = (fork) => {
  return {
    full_name: fork.full_name,
    name: fork.name,
    default_branch: fork.default_branch,
    stargazers_count: fork.stargazers_count,
    forks: fork.forks,
    open_issues_count: fork.open_issues_count,
    size: fork.size,
    pushed_at: fork.pushed_at,
    owner: fork.owner.login,
    description: fork.description,
  };
};
function getMinutesUntil(date) {
  const now = new Date();
  const difference = date.getTime() - now.getTime(); // Difference in milliseconds
  const minutes = Math.floor(difference / 1000 / 60); // Convert milliseconds to minutes
  return minutes;
}

const isCorrectFormat = (data) => {
  //regex test if string is a github repo link
 // const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
//
 // return regex.test(data);
}
const formatRepoString = repo => {
  repo = repo.replace('https://github.com/', '');
  repo = repo.replace('http://github.com/', '');
  repo = repo.replace('.git', '');
  return repo;
};


const forkObjectFormatter = (fork) => {
  return {
    id: fork.id,
    fullName: fork.full_name,
    name: fork.name,
    defaultBranch: fork.default_branch,
    stars: fork.stargazers_count,
    forks: fork.forks,
    openIssuesCount: fork.open_issues_count,
    size: fork.size,
    pushedAt: fork.pushed_at,
    createdAt: fork.created_at,
    updatedAt: fork.updated_at,
    owner: fork.owner.login,
    description: fork.description,
    isTheOriginal: fork.isTheOriginal || false,
    commitsAhead:0,
    commitsBehind:0
  };
};
const multiLimiter = (data) => data.map(originalRepoDataFormatter);
const multiLimiter2 = (data) => data.map(forkObjectFormatter);

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
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

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
  forkObjectFormatter, formatRepoString, isCorrectFormat, getMinutesUntil
};
