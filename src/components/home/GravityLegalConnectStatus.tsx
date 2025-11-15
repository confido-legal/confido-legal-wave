import { useSession } from '@/components/layout/SessionProvider';
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Stack,
  StackDivider,
  Text,
  Link,
  AlertIcon,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import OnboardingFormModal from '../onboarding-form/OnboardingFormModal';

export const GravityLegalConnectionStatus: FC = (props) => {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const session = useSession();
  const { firm, glFirm } = session;

  const applicationMessage = () => {
    if (glFirm?.isAcceptingPayments) {
      return 'Your payments application is approved. You are ready to collect money!';
    }

    return "Your payments application is pending. Once approved you'll be able to collect money!";
  };

  const applicationBadge = () => {
    if (glFirm?.isAcceptingPayments) {
      return <Badge colorScheme='green'>Ready</Badge>;
    }

    return <Badge colorScheme='yellow'>Pending</Badge>;
  };

  const truncatedFirmId = () => {
    if (!glFirm?.id) {
      return '';
    }

    return glFirm.id.slice(0, 6) + '...' + glFirm.id.slice(-6);
  };

  return (
    <>
      <Container>
        <Box as='section' py={{ base: '4', md: '8' }} maxW='3xl'>
          <Box
            bg='white'
            boxShadow='sm'
            borderRadius='lg'
            p={{ base: '4', md: '6' }}
          >
            <Stack spacing='5' divider={<StackDivider />}>
              <Stack
                justify='space-between'
                direction={{ base: 'column', sm: 'row' }}
                spacing='5'
              >
                <Stack spacing='1'>
                  <Text textStyle='lg' fontWeight='medium'>
                    Connected to Confido Legal ✅
                  </Text>
                  <Text textStyle='xs' color='fg.muted'>
                    <strong>{glFirm?.name}</strong> {truncatedFirmId()}
                  </Text>
                </Stack>
                <DisconnectButton />
              </Stack>
              <Stack justify='space-between' direction='row' spacing='4'>
                <Stack spacing='0.5' fontSize='sm'>
                  <Text color='fg.emphasized' fontWeight='medium'>
                    Application Status
                  </Text>
                  <Text color='fg.muted'>{applicationMessage()}</Text>
                </Stack>

                <Box>{applicationBadge()}</Box>
              </Stack>
              {!glFirm?.isAcceptingPayments && (
                <Stack spacing='4'>
                  <Button onClick={() => setShowOnboardingModal(true)}>
                    Complete application
                  </Button>
                  <Alert status='info'>
                    <AlertIcon />
                    <Text textStyle='sm'>
                      You can activate the firm using sandbox tools in the{' '}
                      <Link
                        color='blue.500'
                        href='https://app.sandbox.confidolegal.com'
                        isExternal
                      >
                        sandbox
                      </Link>{' '}
                      when emulating an admin for your firm. If you want to fill
                      out the application faster, there is also an autofill
                      feature in the sandbox.
                    </Text>
                  </Alert>
                </Stack>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
      <OnboardingFormModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </>
  );
};

export interface DisconnectButtonProps {}

const DisconnectButton: FC<DisconnectButtonProps> = (props) => {
  const [loading, setLoading] = useState(false);

  const handleDisconnect = async () => {
    setLoading(true);

    const result = await fetch('/api/disconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setLoading(false);
    window.location.reload();
  };

  return (
    <Button alignSelf='start' isLoading={loading} onClick={handleDisconnect}>
      Disconnect
    </Button>
  );
};
