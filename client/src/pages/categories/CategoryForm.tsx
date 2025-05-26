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
} from '@chakra-ui/react';
import { categoryApi } from '../../services/api';

interface CategoryFormData {
  name: string;
}

const initialFormData: CategoryFormData = {
  name: ''
};

const CategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const navigate = useNavigate();
  const toast = useToast();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchCategory = async () => {
        try {
          setFetchingData(true);
          const response = await categoryApi.getById(id!);
          const category = response.data;

          setFormData({
            name: category.name,
          });
        } catch (error) {
          console.error('Error fetching category:', error);
          toast({
            title: 'Error fetching category details',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setFetchingData(false);
        }
      };

      fetchCategory();
    }
  }, [id, isEditing, toast]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name as keyof CategoryFormData]) {
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
        await categoryApi.update(id!, formData);
        toast({
          title: 'Category updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await categoryApi.create(formData);
        toast({
          title: 'Category created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      navigate('/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: `Error ${isEditing ? 'updating' : 'creating'} category`,
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
      <Heading mb={6}>{isEditing ? 'Edit Category' : 'Create Category'}</Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category name"
            />
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
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
              to="/categories"
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

export default CategoryForm; 