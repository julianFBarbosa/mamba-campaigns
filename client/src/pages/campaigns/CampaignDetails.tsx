import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Badge,
  Spinner,
  Flex,
  Button,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { campaignApi } from '../../services/api';
import { useRef } from 'react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  categoryId?: string;
  status: string;
  category?: {
    id: string;
    name: string;
  };
}

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await campaignApi.getById(id);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast({
          title: 'Error fetching campaign details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      await campaignApi.delete(id);
      toast({
        title: 'Campaign deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/campaigns');
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

  if (loading) {
    return (
      <Flex justify="center" my={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!campaign) {
    return (
      <Box textAlign="center" my={8}>
        <Heading size="md">Campaign not found</Heading>
        <Button as={RouterLink} to="/campaigns" mt={4}>
          Back to Campaigns
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Card mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="lg">{campaign.name}</Heading>

            <Stack direction="row">
              <Button
                as={RouterLink}
                to={`/campaigns/${id}/edit`}
                leftIcon={<EditIcon />}
                colorScheme="yellow"
              >
                Edit
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                onClick={onOpen}
              >
                Delete
              </Button>
            </Stack>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          <Stack spacing={4}>
            <Flex gap={6}>
              <Box>
                <Text fontWeight="bold">Start Date:</Text>
                <Text>{new Date(campaign.startDate).toLocaleDateString()}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold">End Date:</Text>
                <Text>{new Date(campaign.endDate).toLocaleDateString()}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold">Status:</Text>
                <Text>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1).toLowerCase()}</Text>
              </Box>
            </Flex>

            {campaign.category && (
              <Box>
                <Text fontWeight="bold">Category:</Text>
                <Badge colorScheme="green">{campaign.category.name}</Badge>
              </Box>
            )}
          </Stack>
        </CardBody>
      </Card>

      <Button as={RouterLink} to="/campaigns">
        Back to Campaigns
      </Button>

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
              Are you sure you want to delete this campaign?
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

export default CampaignDetails; 