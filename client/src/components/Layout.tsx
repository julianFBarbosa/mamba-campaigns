import { Box, Flex, Heading, Link as ChakraLink, Container } from '@chakra-ui/react';
import { Link as RouterLink, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Box minH="100vh" width="100vw" alignItems="stretch" flexDirection="column" display="flex">
      <Box as="header" bg="teal.500" color="white" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="md">Mamba Culture</Heading>
            <Flex gap={6}>
              <ChakraLink as={RouterLink} to="/" fontWeight="medium">Dashboard</ChakraLink>
              <ChakraLink as={RouterLink} to="/campaigns" fontWeight="medium">Campaigns</ChakraLink>
              <ChakraLink as={RouterLink} to="/categories" fontWeight="medium">Categories</ChakraLink>
            </Flex>
          </Flex>
        </Container>
      </Box>
      
      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout; 