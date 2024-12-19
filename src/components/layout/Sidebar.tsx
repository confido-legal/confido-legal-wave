import { Divider, Flex, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiCreditCard, FiDollarSign, FiHome, FiUser } from 'react-icons/fi';
import { Logo2 } from './Logo';
import { NavButton } from './NavButton';
import { useSession } from './SessionProvider';
import { UserProfile } from './UserProfile';

export const Sidebar = () => {
  const session = useSession();
  const router = useRouter();

  const isActive = (href: string) => router.pathname === href;

  return (
    <Flex as='section' minH='100vh' bg='bg-canvas'>
      <Flex
        flex='1'
        bg='bg-surface'
        overflowY='auto'
        boxShadow='md'
        maxW={{ base: 'full', sm: 'xs' }}
        py={{ base: '6', sm: '8' }}
        px={{ base: '4', sm: '6' }}
      >
        <Stack justify='space-between' spacing='1'>
          <Stack spacing={{ base: '5', sm: '6' }} shouldWrapChildren>
            <Logo2 />
            <Stack spacing='1'>
              <Link href='/' passHref>
                <NavButton
                  label='Home'
                  icon={FiHome}
                  isActive={isActive('/')}
                />
              </Link>

              <Link href='/payment-intents' passHref>
                <NavButton
                  label='Payment Intents'
                  icon={FiDollarSign}
                  isActive={isActive('/payment-intents')}
                />
              </Link>

              <Link href='/stored-payment-methods'>
                <NavButton
                  label='Stored Payment Methods'
                  icon={FiCreditCard}
                  isActive={isActive('/stored-payment-methods')}
                />
              </Link>

              <Link href='/clients'>
                <NavButton
                  label='Clients'
                  icon={FiUser}
                  isActive={isActive('/clients')}
                />
              </Link>
            </Stack>
          </Stack>
          <Stack spacing={{ base: '5', sm: '6' }}>
            <Divider />
            <UserProfile
              name={session.firm!.name}
              image='https://tinyurl.com/yhkm2ek8'
              username={session.user!.username}
            />
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
