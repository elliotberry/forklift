
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

export {
  forkObjectFormatter, formatRepoString, isCorrectFormat, getMinutesUntil
};
