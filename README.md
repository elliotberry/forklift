# forklift 🚛

Live: https://forklift.vercel.app

A better GitHub fork network viewer. See all of the forks of any repo, compare them to the original, and track the action.

Enter your Github token in the configuration to have better github API rate limits and see your usage. Forklift stores your token on your own computer and never sends it anywhere else. You can also use the app without a token, but you'll be limited to 60 API calls per hour.

## What it does

- **Find all forks** of any GitHub repository
- **Compare forks** to the original repo (commits ahead/behind)
- **See what changed** with commit summaries and diff info
- **Pretty data** with formatted sizes, timestamps, and stats
- **Rate limit aware** - shows your GitHub API usage

## Quick start

1. Clone this bad boy
2. `npm install`
3. `npm run dev`
4. Click on the config button and enter your GitHub token
5. Enter a repo in format `owner/repo-name` and hit search

## Features

- 🔍 Search GitHub repositories, revealing their forks and changes thereof.
- 📊 Comparison with commit diffs information for easy grepping of others' input

## Technology

React 19 + Vite / SCSS

## License

Unlicense