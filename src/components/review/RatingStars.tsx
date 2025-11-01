import React from 'react';
import { HStack, Icon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 'md',
  color = 'yellow.400',
  showNumber = false,
  interactive = false,
  onRatingChange
}) => {
  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return '12px';
      case 'lg': return '24px';
      default: return '16px';
    }
  };

  return (
    <HStack spacing={1}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          as={StarIcon}
          color={star <= rating ? color : 'gray.300'}
          fontSize={getSize()}
          cursor={interactive ? 'pointer' : 'default'}
          _hover={interactive ? { transform: 'scale(1.1)' } : {}}
          transition="all 0.2s"
          onClick={() => handleStarClick(star)}
        />
      ))}
      {showNumber && (
        <span style={{ fontSize: getSize(), fontWeight: 'bold', marginLeft: '4px' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </HStack>
  );
};

export default RatingStars;



