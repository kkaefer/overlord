# Overlord

Overlord is a simple *continuous integration* server for npm packages for projects hosted on GitHub. It accepts GitHub webhooks and downloads and runs `npm test` on the updated package.

![Overlord screenshot](http://i.kkaefer.com/overlord-20110515-234253.png)

NOTE: This is beta software.

## Quick setup

* Install dependencies with [`npm`](https://github.com/isaacs/npm)
* Add URLs to `files/repositories.json`. E.g.: `{ "https://github.com/kkaefer/overlord": {} }`
* Start with `./overlord.js`
* Add `http://example.com/api/webhook` as a webhook to your GitHub project
