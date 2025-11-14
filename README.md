![legal wave logo](public/legal-wave-logo.png)

# Legal Wave

Legal Wave is an example application to showcase what can be done with the Confido Legal payments platform. It is written in Typescript using [Next.js](https://nextjs.org/), a React framework. We also use [Chakra UI](https://chakra-ui.com/) to speed up building the UI.

## Getting Started

You will need a Partner account in our sandbox environment to run Legal Wave locally. If you need an account, shoot us an email at support@confidolegal.com

1. Login at [app.sandbox.confidolegal.com](https://app.sandbox.confidolegal.com)
2. Go to Settings and create an api token
3. Rename `.env.template` to `.env.local`
4. Paste your token into `.env.local`

```
CONFIDO_PARTNER_TOKEN=p_secret_xxxxxxxxxxxxx
```

5. Run `npm install` to install dependencies
6. Run `npm run dev`
7. Visit [http://localhost:7001](http://localhost:7001)

### Database

Legal Wave uses a simple sqlite database file located at `prisma/legal-wave.sqlite`. You can wipe the data and start over by running `npm run reset-db`. This just deletes the sqlite file and replaces it with a blank one.

You can easily view the data with any SQLite data viewer. The one I use is [DB Browser for SQLite](https://sqlitebrowser.org/)
