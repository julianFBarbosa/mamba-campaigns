import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Spinner,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { campaignApi } from '../../services/api';
import { useRef } from 'react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
}

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignApi.getAll();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: 'Error fetching campaigns',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async () => {
    if (!selectedCampaign) return;

    try {
      await campaignApi.delete(selectedCampaign.id);
      toast({
        title: 'Campaign deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: 'Error deleting campaign',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const openDeleteDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    onOpen();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Campaigns</Heading>
        <Button
          as={RouterLink}
          to="/campaigns/new"
          leftIcon={<AddIcon />}
          colorScheme="teal"
        >
          New Campaign
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" my={8}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campaigns.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center">No campaigns found</Td>
              </Tr>
            ) : (
              campaigns.map((campaign) => (
                <Tr key={campaign.id}>
                  <Td>{campaign.name}</Td>
                  <Td>{new Date(campaign.startDate).toLocaleDateString()}</Td>
                  <Td>{new Date(campaign.endDate).toLocaleDateString()}</Td>
                  <Td>
                    {campaign.category && (
                      <Badge colorScheme="green">{campaign.category.name}</Badge>
                    )}
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        as={RouterLink}
                        to={`/campaigns/${campaign.id}`}
                        icon={<ViewIcon />}
                        aria-label="View"
                        size="sm"
                        colorScheme="blue"
                      />
                      <IconButton
                        as={RouterLink}
                        to={`/campaigns/${campaign.id}/edit`}
                        icon={<EditIcon />}
                        aria-label="Edit"
                        size="sm"
                        colorScheme="yellow"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete"
                        size="sm"
                        colorScheme="red"
                        onClick={() => openDeleteDialog(campaign)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Campaign
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the campaign "{selectedCampaign?.name}"?
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CampaignsList; 