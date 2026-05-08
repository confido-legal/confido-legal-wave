import { Layout } from '@/components/layout/Layout';
import CreateStoredPaymentMethodModal from '@/components/stored-payment-methods/CreateStoredPaymentMethodModal';
import { requireAuth } from '@/lib/session';
import { Button } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useState } from 'react';

export const getServerSideProps = requireAuth();

const StoredPaymentMethodsPage: NextPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const openCreateModal = () => setCreateModalOpen(true);

  return (
    <Layout>
      <Button onClick={openCreateModal}>Save New Payment Method</Button>

      <CreateStoredPaymentMethodModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </Layout>
  );
};

export default StoredPaymentMethodsPage;
