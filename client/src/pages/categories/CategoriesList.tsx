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
import { categoryApi } from '../../services/api';
import { useRef } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await categoryApi.delete(selectedCategory.id);
      toast({
        title: 'Category deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchCategories();
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

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    onOpen();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Categories</Heading>
        <Button
          as={RouterLink}
          to="/categories/new"
          leftIcon={<AddIcon />}
          colorScheme="teal"
        >
          New Category
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
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.length === 0 ? (
              <Tr>
                <Td colSpan={3} textAlign="center">No categories found</Td>
              </Tr>
            ) : (
              categories.map((category) => (
                <Tr key={category.id}>
                  <Td>{category.name}</Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        as={RouterLink}
                        to={`/categories/${category.id}`}
                        icon={<ViewIcon />}
                        aria-label="View"
                        size="sm"
                        colorScheme="blue"
                      />
                      <IconButton
                        as={RouterLink}
                        to={`/categories/${category.id}/edit`}
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
                        onClick={() => openDeleteDialog(category)}
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
              Delete Category
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the category "{selectedCategory?.name}"?
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

export default CategoriesList; 