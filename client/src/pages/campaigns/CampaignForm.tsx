import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  Stack,
  Flex,
  Spinner,
  useToast,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import { campaignApi, categoryApi } from '../../services/api';

interface Category {
  id: string;
  name: string;
}

enum Status {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  EXPIRED = 'Expired',
}


interface CampaignFormData {
  name: string;
  startDate?: Date;
  endDate?: Date;
  categoryId: string;
  status: Status;
}

const initialFormData: CampaignFormData = {
  name: '',
  startDate: new Date(),
  endDate: undefined,
  categoryId: '',
  status: Status.ACTIVE,
};

const CampaignForm = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Partial<CampaignFormData>>({});
  const navigate = useNavigate();
  const toast = useToast();
  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error fetching categories',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchCategories();
  }, [toast]);

  useEffect(() => {
    if (isEditing) {
      const fetchCampaign = async () => {
        try {
          setFetchingData(true);
          const response = await campaignApi.getById(id!);
          const campaign = response.data;

          setFormData({
            name: campaign.name,
            startDate: campaign.startDate.split('T')[0],
            endDate: campaign.endDate.split('T')[0],
            categoryId: campaign.categoryId || '',
            status: campaign.status,
          });
        } catch (error) {
          console.error('Error fetching campaign:', error);
          toast({
            title: 'Error fetching campaign details',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setFetchingData(false);
        }
      };

      fetchCampaign();
    }
  }, [id, isEditing, toast]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CampaignFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.startDate) {
      toast({
        title: 'Start date is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    if (!formData.endDate) {
      toast({
        title: 'End date is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({
        title: 'End date must be after start date',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name as keyof CampaignFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await campaignApi.update(id!, {
          ...formData,
          status: formData.status.toUpperCase(),
          categoryId: Number(formData.categoryId),
          startDate: new Date(formData.startDate!).toISOString(),
          endDate: new Date(formData.endDate!).toISOString(),
        });
        toast({
          title: 'Campaign updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await campaignApi.create({
          ...formData,
          status: formData.status.toUpperCase(),
          categoryId: Number(formData.categoryId),
          startDate: new Date(formData.startDate!).toISOString(),
          endDate: new Date(formData.endDate!).toISOString(),
        });

        toast({
          title: 'Campaign created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      navigate('/campaigns');
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: `Error ${isEditing ? 'updating' : 'creating'} campaign`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Flex justify="center" my={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box>
      <Heading mb={6}>{isEditing ? 'Edit Campaign' : 'Create Campaign'}</Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Campaign name"
            />
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.startDate}>
            <FormLabel>Start Date</FormLabel>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <FormErrorMessage>{errors.startDate.toString()}</FormErrorMessage>}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.endDate}>
            <FormLabel>End Date</FormLabel>
            <Input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <FormErrorMessage>{errors.endDate.toString()}</FormErrorMessage>}
          </FormControl>

          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              name="categoryId"
              value={Number(formData.categoryId)}
              onChange={handleChange}
              placeholder="Select category"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Select status"
            >
              {Object.values(Status).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </FormControl>

          <Flex gap={4} mt={4}>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={loading}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button
              as={RouterLink}
              to="/campaigns"
              variant="outline"
            >
              Cancel
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

export default CampaignForm; 