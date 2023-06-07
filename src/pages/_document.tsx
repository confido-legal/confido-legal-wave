import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src='http://localhost:5009/index.js' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
