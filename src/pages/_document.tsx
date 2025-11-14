import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  const hostedFieldsJsSrc =
    process.env.NEXT_PUBLIC_CONFIDO_SDK_URL ||
    'https://js.sandbox.gravity-legal.com/hosted-fields.js';

  const onboardingJsSrc =
    process.env.NEXT_PUBLIC_CL_ONBOARDING_JS_URL ||
    'https://js.sandbox.gravity-legal.com/onboarding.js';

  return (
    <Html lang='en'>
      <Head>
        <script src={hostedFieldsJsSrc} async />
        <script src={onboardingJsSrc} async />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
