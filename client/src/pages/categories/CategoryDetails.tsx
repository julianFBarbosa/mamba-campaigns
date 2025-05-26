import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
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
import { categoryApi } from '../../services/api';
import { useRef } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await categoryApi.getById(id);
        setCategory(response.data);
      } catch (error) {
        console.error('Error fetching category:', error);
        toast({
          title: 'Error fetching category details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await categoryApi.delete(id);
      toast({
        title: 'Category deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error deleting category',
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

  if (!category) {
    return (
      <Box textAlign="center" my={8}>
        <Heading size="md">Category not found</Heading>
        <Button as={RouterLink} to="/categories" mt={4}>
          Back to Categories
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>{category.name}</Heading>
        <Stack direction="row">
          <Button
            as={RouterLink}
            to={`/categories/${id}/edit`}
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

      <Card mb={6}>
        <CardHeader>
          <Heading size="md">Category Details</Heading>
        </CardHeader>
        <Divider />
        <CardBody>
          <Stack spacing={4}>
            <Box>
              <Text fontWeight="bold">Title:</Text>
              <Text>{category.name}</Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Button as={RouterLink} to="/categories">
        Back to Categories
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Category
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this category?
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

export default CategoryDetails; 