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
    subtitle: 'O(log n) indexing algorithm',
    algorithm: 'Binary Search',
    category: 'SEARCH SYSTEMS',
    difficulty: 'Beginner',
    learningTime: '5 min',
    realWorldSystem: 'Database Indexes',
    description: 'Explore how search infrastructure rapidly locates specific records within massive, ordered datasets by systematically bisecting the search space.',
    isAvailable: true,
    iconName: 'Library',
  },
  {
    id: '2',
    slug: 'city-map',
    title: 'City Map Navigator',
    subtitle: 'Optimal path computation',
    algorithm: 'Dijkstra’s Algorithm',
    category: 'ROUTING SYSTEMS',
    difficulty: 'Intermediate',
    learningTime: '8 min',
    realWorldSystem: 'Routing Infrastructure',
    description: 'Discover how routing protocols and mapping systems compute the most efficient path across complex, weighted networks.',
    isAvailable: true,
    iconName: 'Map',
  },
  {
    id: '3',
    slug: 'elevator-dispatch',
    title: 'Elevator Dispatch',
    subtitle: 'Real-time queue scheduling',
    algorithm: 'Queue Scheduling',
    category: 'SCHEDULING SYSTEMS',
    difficulty: 'Beginner',
    learningTime: '6 min',
    realWorldSystem: 'Task Scheduling Systems',
    description: 'Analyze how systems process concurrent requests, balancing strict fairness (FIFO) with overall throughput optimization (SSTF).',
    isAvailable: true,
    iconName: 'ArrowUpDown',
  },
  {
    id: '4',
    slug: 'delivery-route',
    title: 'Delivery Route Planner',
    subtitle: 'Heuristic routing models',
    algorithm: 'Greedy Algorithm',
    category: 'LOGISTICS SYSTEMS',
    difficulty: 'Intermediate',
    learningTime: '7 min',
    realWorldSystem: 'Supply Chain Logistics',
    description: 'Examine how heuristic models calculate efficient delivery routes by continuously evaluating and selecting the immediate optimal choice.',
    isAvailable: true,
    iconName: 'Truck',
  },
  {
    id: '5',
    slug: 'recommendation-room',
    title: 'Recommendation Room',
    subtitle: 'Predictive similarity scoring',
    algorithm: 'Similarity Scoring',
    category: 'RECOMMENDATION SYSTEMS',
    difficulty: 'Advanced',
    learningTime: '10 min',
    realWorldSystem: 'Algorithmic Discovery',
    description: 'Investigate how content platforms predict user preferences through associative data modeling and high-dimensional similarity scoring.',
    isAvailable: true,
    iconName: 'Sparkles',
  },
];
