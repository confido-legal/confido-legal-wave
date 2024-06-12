import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Badge,
  Button,
  Container,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import OnboardingFormModal from '../onboarding-form/OnboardingFormModal';

export interface Props {
  connectUrl: string;
}

export const ConnectionOptionsSplash: FC<Props> = ({ connectUrl }) => {
  const router = useRouter();
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);

  const handleModalClose = () => {
    setShowOnboardingForm(false);
    router.reload();
  };

  return (
    <>
      <Container py={{ base: '16', md: '24' }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={12}>
          <Stack spacing={{ base: '4', md: '6' }}>
            <Stack spacing='4'>
              <Text
                fontWeight='semibold'
                color='accent'
                textStyle={{ base: 'sm', md: 'md' }}
              >
                Connect
              </Text>
              <Heading as='h1' size={{ base: 'md', md: 'lg' }}>
                Let&apos;s get started 🚀
              </Heading>
            </Stack>
            <Text textStyle={{ base: 'lg', md: 'xl' }} color='fg.muted'>
              Get started by connecting your Legal Wave account to a Confido
              Legal account.
            </Text>
          </Stack>
          <Accordion defaultIndex={0}>
            <AccordionItem py='4'>
              <AccordionButton gap={4} px='0'>
                <Text as='h2' fontWeight='semibold' textStyle='xl'>
                  Connect
                </Text>
                <Badge variant='pill'>Existing Confido Legal accounts</Badge>
              </AccordionButton>
              <AccordionPanel px='0'>
                <Stack spacing={{ base: '6', md: '8' }}>
                  <Stack spacing={{ base: '4', md: '5' }}>
                    <Text color='fg.muted'>
                      With Connect, users <i>connect</i> their existing Gravity
                      Legal account to their Legal Wave account. Connecting
                      gives Legal Wave permission to manage the firm&apos;s
                      Confido Legal account on their behalf.
                    </Text>
                  </Stack>
                  <Stack spacing={{ base: '4' }}>
                    <Text color='fg.muted'>
                      To get started with Connect follow the link below.
                    </Text>
                    <Link
                      href={connectUrl}
                      isExternal
                      color='accent'
                      rel='opener'
                    >
                      {connectUrl + ' '}
                      <ExternalLinkIcon mx='2px' />
                    </Link>
                  </Stack>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem py='4'>
              <AccordionButton gap={4} px='0'>
                <Text as='h2' fontWeight='semibold' textStyle='xl'>
                  Sign Up Link
                </Text>
                <Badge variant='pill'>New Confido Legal accounts</Badge>
              </AccordionButton>
              <AccordionPanel px='0'>
                <Stack spacing={{ base: '6', md: '8' }}>
                  <Stack spacing={{ base: '4', md: '5' }}>
                    <Text color='fg.muted'>
                      Sign Up Link is for firms who don&apos;t already have a
                      Confido Legal account. Partner&apos;s will create a new
                      Firm through the API then direct their users to a unique
                      sign up link for that Firm.
                    </Text>
                  </Stack>
                  <Stack spacing={{ base: '4' }}>
                    <Text color='fg.muted'>
                      To get started with a new Confido Legal account, click the
                      button below.
                    </Text>
                    <SignUpForConfidoLegalButton />
                  </Stack>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem py='4'>
              <AccordionButton gap={4} px='0'>
                <Text as='h2' fontWeight='semibold' textStyle='xl'>
                  Onboarding.js
                </Text>
                <Badge variant='pill'>New accounts, apply here!</Badge>
              </AccordionButton>
              <AccordionPanel px='0'>
                <Stack spacing={{ base: '6', md: '8' }}>
                  <Stack spacing={{ base: '4', md: '5' }}>
                    <Text color='fg.muted'>
                      Like Sign Up Links, Onboarding.js is for firms who
                      don&apos;t already have a Confido Legal account. But,
                      instead of directing firms to the Confido Legal app, we
                      can embed the onboarding form directly in our app.
                    </Text>
                  </Stack>
                  <Stack spacing={{ base: '4' }}>
                    <Text color='fg.muted'>
                      To see the Onboarding.js form in action, click the button
                      below.
                    </Text>
                    <Button
                      alignSelf='start'
                      colorScheme='blue'
                      variant='solid'
                      onClick={() => setShowOnboardingForm(true)}
                    >
                      Apply Now!
                    </Button>
                  </Stack>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </SimpleGrid>
      </Container>
      <OnboardingFormModal
        isOpen={showOnboardingForm}
        onClose={handleModalClose}
      />
    </>
  );
};

const SignUpForConfidoLegalButton: FC = (props) => {
  const [loading, setLoading] = useState(false);

  const handleSignUpForConfidoLegal = async () => {
    setLoading(true);

    const result = await fetch('/api/get-sign-up-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await result.json();
    window.open(json.link, '_blank');
    setLoading(false);
  };

  return (
    <Button
      alignSelf='start'
      colorScheme='blue'
      isLoading={loading}
      variant='solid'
      onClick={handleSignUpForConfidoLegal}
    >
      Sign Up For Confido Legal
    </Button>
  );
};
