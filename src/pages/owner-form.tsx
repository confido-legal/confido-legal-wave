import { Alert, Container } from '@chakra-ui/react';
import { NextPage } from 'next';
import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import { useEffect } from 'react';

const OwnerFormPage: NextPage<WithRouterProps> = ({ router }) => {
  const { query } = router;
  const code = query.o_code as string;

  useEffect(() => {
    if (!code) {
      return;
    }

    window.confidoOnboarding.renderOwnerForm({
      code,
      containerId: 'confido-owner-form',
    });
  }, [code]);

  return (
    <Container
      maxW='lg'
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      {!code && <Alert status='error'>Invalid url</Alert>}
      <div id='confido-owner-form' />
    </Container>
  );
};

export default withRouter(OwnerFormPage);
