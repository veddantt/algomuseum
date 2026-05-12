export interface Exhibit {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  algorithm: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  learningTime: string;
  realWorldSystem: string;
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
    category: 'SEARCH SYSTEMS',
    difficulty: 'Beginner',
    learningTime: '5 min',
    realWorldSystem: 'Database Indexes',
    description: 'Learn how binary search efficiently finds an item in a sorted list by repeatedly halving the search space.',
    isAvailable: true,
    iconName: 'Library',
  },
  {
    id: '2',
    slug: 'city-map',
    title: 'City Map Navigator',
    subtitle: 'Finding the shortest path',
    algorithm: 'Dijkstra’s Algorithm',
    category: 'ROUTING SYSTEMS',
    difficulty: 'Intermediate',
    learningTime: '8 min',
    realWorldSystem: 'GPS Navigation',
    description: 'Explore how maps calculate the quickest route between two locations using graph traversal.',
    isAvailable: true,
    iconName: 'Map',
  },
  {
    id: '3',
    slug: 'elevator-dispatch',
    title: 'Elevator Dispatch',
    subtitle: 'Managing requests in order',
    algorithm: 'Queue Scheduling',
    category: 'SCHEDULING SYSTEMS',
    difficulty: 'Beginner',
    learningTime: '6 min',
    realWorldSystem: 'Operating Systems',
    description: 'Understand how elevators decide which floor to go to next based on queues and optimization.',
    isAvailable: true,
    iconName: 'ArrowUpDown',
  },
  {
    id: '4',
    slug: 'delivery-route',
    title: 'Delivery Route Planner',
    subtitle: 'Making the best local choice',
    algorithm: 'Greedy Algorithm',
    category: 'LOGISTICS SYSTEMS',
    difficulty: 'Intermediate',
    learningTime: '7 min',
    realWorldSystem: 'Delivery Optimization',
    description: 'See how delivery drivers optimize their routes by always taking the nearest next drop-off point.',
    isAvailable: true,
    iconName: 'Truck',
  },
  {
    id: '5',
    slug: 'recommendation-room',
    title: 'Recommendation Room',
    subtitle: 'Suggesting what you like',
    algorithm: 'Similarity Scoring',
    category: 'RECOMMENDATION SYSTEMS',
    difficulty: 'Advanced',
    learningTime: '10 min',
    realWorldSystem: 'Content Discovery',
    description: 'Discover how platforms recommend movies and products based on your past preferences.',
    isAvailable: true,
    iconName: 'Sparkles',
  },
];
