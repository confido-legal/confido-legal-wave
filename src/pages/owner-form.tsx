import { Container } from '@chakra-ui/react';
import { NextPage } from 'next';
import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import { useEffect } from 'react';

const OwnerFormPage: NextPage<WithRouterProps> = ({ router }) => {
  const { query } = router;
  const code = query.o_code as string;

  if (!code) {
    return <div>invalid url</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    window.confidoOnboarding.renderOwnerForm({
      code,
      containerId: 'confido-owner-form',
    });
  }, [code]);

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <div id="confido-owner-form" />
    </Container>
  );
};

export default withRouter(OwnerFormPage);
