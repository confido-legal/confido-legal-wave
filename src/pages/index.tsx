import { ConnectionOptionsSplash } from '@/components/home/ConnectionOptionsSplash';
import { GravityLegalConnectionStatus } from '@/components/home/GravityLegalConnectStatus';
import PaymentVehicleSplash from '@/components/home/PaymentVehiclesSplash';
import { Layout } from '@/components/layout/Layout';
import { useSession } from '@/components/layout/SessionProvider';
import { getMyPartner } from '@/confido-legal-requests/getMyPartner';
import { requireAuth } from '@/lib/session';
import { Container } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = requireAuth(async () => {
  const partner = await getMyPartner();
  const connectUrl = `${process.env.NEXT_PUBLIC_GL_APP_DOMAIN}/connect/${partner.appId}`;

  return {
    props: {
      connectUrl,
    },
  };
});

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  console.log('props: ', props);

  const session = useSession();
  const { firm } = session;

  return (
    <Layout>
      <Container py='8' height='full'>
        {!firm?.glApiToken && (
          <ConnectionOptionsSplash connectUrl={props.connectUrl} />
        )}
        {firm?.glApiToken && <GravityLegalConnectionStatus />}
        {session.glFirm?.isAcceptingPayments && <PaymentVehicleSplash />}
      </Container>
    </Layout>
  );
}
