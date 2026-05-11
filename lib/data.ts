export interface Exhibit {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  algorithm: string;
  description: string;
  isAvailable: boolean;
  iconName: string;
}

export const exhibits: Exhibit[] = [
  {
    id: '1',
    slug: 'binary-search',
    title: 'Smart Search Shelf',
    subtitle: 'Finding items in sorted order',
    algorithm: 'Binary Search',
    description: 'Learn how binary search efficiently finds an item in a sorted list by repeatedly halving the search space.',
    isAvailable: true,
    iconName: 'Library',
  },
  {
    id: '2',
    slug: 'dijkstra',
    title: 'City Map Navigator',
    subtitle: 'Finding the shortest path',
    algorithm: 'Dijkstra’s Algorithm',
    description: 'Explore how maps calculate the quickest route between two locations using graph traversal.',
    isAvailable: false,
    iconName: 'Map',
  },
  {
    id: '3',
    slug: 'queue-scheduling',
    title: 'Elevator Dispatch',
    subtitle: 'Managing requests in order',
    algorithm: 'Queue Scheduling',
    description: 'Understand how elevators decide which floor to go to next based on queues and optimization.',
    isAvailable: false,
    iconName: 'ArrowUpDown',
  },
  {
    id: '4',
    slug: 'greedy-algorithm',
    title: 'Delivery Route Planner',
    subtitle: 'Making the best local choice',
    algorithm: 'Greedy Algorithm',
    description: 'See how delivery drivers optimize their routes by always taking the nearest next drop-off point.',
    isAvailable: false,
    iconName: 'Truck',
  },
  {
    id: '5',
    slug: 'similarity-scoring',
    title: 'Recommendation Room',
    subtitle: 'Suggesting what you like',
    algorithm: 'Similarity Scoring',
    description: 'Discover how platforms recommend movies and products based on your past preferences.',
    isAvailable: false,
    iconName: 'ThumbsUp',
  },
];
