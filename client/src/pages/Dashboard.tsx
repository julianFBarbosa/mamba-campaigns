import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Button, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { campaignApi, categoryApi } from '../services/api';

const Dashboard = () => {
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campaignsRes, categoriesRes] = await Promise.all([
          campaignApi.getAll(),
          categoryApi.getAll(),
        ]);
        
        setCampaignsCount(campaignsRes.data.length);
        setCategoriesCount(categoriesRes.data.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Dashboard</Heading>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Campaigns</StatLabel>
              <StatNumber>{loading ? '...' : campaignsCount}</StatNumber>
              <StatHelpText>Active marketing campaigns</StatHelpText>
              <Button as={RouterLink} to="/campaigns" colorScheme="teal" size="sm" mt={2}>
                View All Campaigns
              </Button>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Categories</StatLabel>
              <StatNumber>{loading ? '...' : categoriesCount}</StatNumber>
              <StatHelpText>Campaign categories</StatHelpText>
              <Button as={RouterLink} to="/categories" colorScheme="teal" size="sm" mt={2}>
                View All Categories
              </Button>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard; 