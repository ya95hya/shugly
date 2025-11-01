import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import RatingStars from './RatingStars';

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string }) => void;
  loading?: boolean;
}

interface ReviewFormData {
  comment: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, loading = false }) => {
  const [rating, setRating] = useState(0);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReviewFormData>();

  const handleFormSubmit = (data: ReviewFormData) => {
    if (rating === 0) {
      return;
    }
    onSubmit({ rating, comment: data.comment });
    setRating(0);
    reset();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>التقييم</FormLabel>
            <VStack spacing={2}>
              <RatingStars
                rating={rating}
                interactive={true}
                onRatingChange={setRating}
                size="lg"
              />
              <Text fontSize="sm" color="gray.600">
                {rating === 0 ? 'اختر التقييم' : 
                 rating === 1 ? 'سيء جداً' :
                 rating === 2 ? 'سيء' :
                 rating === 3 ? 'متوسط' :
                 rating === 4 ? 'جيد' : 'ممتاز'}
              </Text>
            </VStack>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>التعليق</FormLabel>
            <Textarea
              {...register('comment', { required: 'يرجى كتابة تعليق' })}
              placeholder="اكتب تعليقك عن الخدمة..."
              rows={4}
            />
            {errors.comment && (
              <Text color="red.500" fontSize="sm">
                {errors.comment.message}
              </Text>
            )}
          </FormControl>

          {rating === 0 && (
            <Alert status="warning" size="sm">
              <AlertIcon />
              <Text fontSize="sm">يرجى اختيار التقييم أولاً</Text>
            </Alert>
          )}

          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            w="full"
            isLoading={loading}
            loadingText="جاري إرسال التقييم..."
            isDisabled={rating === 0}
          >
            إرسال التقييم
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ReviewForm;



