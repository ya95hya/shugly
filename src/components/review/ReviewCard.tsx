import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Divider
} from '@chakra-ui/react';
import { Review } from '../../firebase/firestore';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  review: Review;
  showWorkerInfo?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showWorkerInfo = false }) => {
  return (
    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" align="start">
          <HStack>
            <Avatar size="sm" name="مستخدم" />
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium" fontSize="sm">مستخدم</Text>
              <Text fontSize="xs" color="gray.500">
                {new Date(review.createdAt).toLocaleDateString('en-GB')}
              </Text>
            </VStack>
          </HStack>
          
          <RatingStars rating={review.rating} size="sm" />
        </HStack>
        
        <Text fontSize="sm" color="gray.700">
          {review.comment}
        </Text>
        
        {showWorkerInfo && (
          <>
            <Divider />
            <Text fontSize="xs" color="gray.500">
              تقييم لخدمة: غير محدد
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ReviewCard;
