const forkObjectFormatter = function (fork) {


  return {
    id: fork.id,
    forkId: `${fork.owner.login}/${fork.name}`,
    fullName: fork.full_name,
    //name: fork.name,
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
    commitsAhead: 0,
    commitsBehind: 0,
    commitsList: [],
    original: fork,
  };
};

class Api {
  constructor(originalRepoString, token, onRateLimit = function () {}) {
    this.config = token
      ? {
          headers: {
            authorization: `token ${token}`,
          },
        }
      : undefined;
    this.onRateLimit = onRateLimit;
    this.rate = {
      remaining: '?',
      limit: '?',
      reset: new Date(),
    };
    this.originalRepoString = originalRepoString;
    this.originalRepo = {};

    this.forks = [];

    console.log('init Api');
    return this.init();
  }

  handleError(error) {
    console.error(`Error in github api file: ${error}`);
  }

  async get(url, onGetURL = function () {}) {
    try {
      const response = await fetch(url, this.config);
      if (response.status !== 200 || response.ok === false) {
        let error = `${response.status} ${response.statusText}`;
        try {
          const data = await response.json();
          error = error + `: ${JSON.stringify(data, null, 2)}`;
        }
        catch (e) {
          console.error(e);
        }
        throw new Error(`${response.status} ${response.statusText}`);
     } else {
        this.updateRate(response);
        const data = await response.json();
        return data;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  getLimits() {
    return this.rate;
  }

  async refreshLimits() {
    try {
      const url = 'https://api.github.com/rate_limit';
      const response = await this.get(url);
      if (response.ok) this.updateRate(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  updateRate({headers}) {
    try {
      this.rate.limit = headers.get('x-ratelimit-limit');
      this.rate.remaining = headers.get('x-ratelimit-remaining');
      this.rate.reset = new Date(1000 * parseInt(headers.get('x-ratelimit-reset')));
      this.onRateLimit(this.rate);
    } catch (error) {
      this.handleError(error);
    }
  }

  summarizeChanges(changes) {
    const summary = changes.reduce((acc, change) => {
      const {status, additions, deletions, filename} = change;

      if (!acc[status]) {
        acc[status] = {
          files: [],
          totalAdditions: 0,
          totalDeletions: 0,
          totalChanges: 0,
        };
      }

      acc[status].files.push({
        filename,
        additions,
        deletions,
      });

      acc[status].totalAdditions += additions;
      acc[status].totalDeletions += deletions;
      acc[status].totalChanges += additions + deletions;

      return acc;
    }, {});

    return summary;
  }

  async getDiff(forkObject) {
    try {
      const fullName = this.originalRepo.full_name;
      const defaultBranch = this.originalRepo.default_branch;
      const {defaultBranch: forkDefaultBranch, owner: forkOwner, forkid} = forkObject;
      const url = `https://api.github.com/repos/${fullName}/compare/${defaultBranch}...${forkOwner}:${forkDefaultBranch}`;
      const data = await this.get(url);
      data.commitsList = data.commits.map(commit => {
        return {
          sha: commit.sha,
          message: commit.commit.message,
         // author: commit.author.name || commit.commit.author.name,
          date: commit.commit.author.date,
          url: commit.url
        };
      });
      //  delete data.commits;
      data.simpleSummary = this.summarizeChanges(data.files);
      data.forkId = `${forkObject.fullName}`;
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOriginalRepo() {
    const originalRepo = await this.get(`https://api.github.com/repos/${this.originalRepoString}`);
    return originalRepo;
  }

  async getSingleForkPage(page = 1) {
    try {
      const url = `https://api.github.com/repos/${this.originalRepoString}/forks?sort=stargazers&per_page=100&page=${page}`;
      const someData = await this.get(url);
      return someData;
    } catch (error) {
      console.error(error);
    }
  }

  async getForks(onGetForks = async function () {}) {
    let numberOfPages = Math.ceil(this.originalRepo.forks / 100);

    let asyncIterator = Array.from({length: numberOfPages}, (_, i) => i + 1);
    console.log(`getting ${numberOfPages} pages of forks`);
    let allForks = [];
    for await (let page of asyncIterator) {
      let forks = await this.getSingleForkPage(page);
      forks = forks.map(forkObjectFormatter);
      let shouldContinue = await onGetForks(forks);
      
      allForks = allForks.concat(forks);
      if (shouldContinue === false) {
        break;
      }
    }
    return allForks;
  }
  async getAllDiffs(forksToCompare, onGetDiff = async function () {}) {
    let asyncIterator = forksToCompare;
    let allDiffs = [];
    for await (let fork of asyncIterator) {
      let diff = await this.getDiff(fork);
      
      allDiffs.push(diff);
      let shouldContinue = await onGetDiff(diff);
      if (shouldContinue === false) {
        break;
      }
    }
    return allDiffs;
  }

  async init() {
    this.originalRepo = await this.getOriginalRepo();

    return this;
  }

  async getForksToCompare(allForks) {
    let originalRepo = this.originalRepo;

    const forksToCompare = allForks.filter(thisFork => {
      let ret = false;
      if (thisFork.original.size !== originalRepo.size || thisFork.pushedAt !== originalRepo.pushedAt) {
        ret = true;
      }
      return ret;
    });
    return forksToCompare;
  }
}

export {Api, forkObjectFormatter};
