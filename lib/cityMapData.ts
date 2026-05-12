export const nodes = [
  { id: "home", label: "Home", x: 10, y: 50, icon: require("lucide-react").Home },
  { id: "cafe", label: "Cafe", x: 30, y: 20, icon: require("lucide-react").Coffee },
  { id: "gym", label: "Gym", x: 30, y: 80, icon: require("lucide-react").Dumbbell },
  { id: "office", label: "Office", x: 50, y: 50, icon: require("lucide-react").Briefcase },
  { id: "library", label: "Library", x: 65, y: 20, icon: require("lucide-react").BookOpen },
  { id: "park", label: "Park", x: 60, y: 85, icon: require("lucide-react").TreePine },
  { id: "station", label: "Station", x: 85, y: 40, icon: require("lucide-react").Train },
  { id: "hospital", label: "Hospital", x: 85, y: 75, icon: require("lucide-react").Cross }
];

export const edges = [
  { id: "e1", source: "home", target: "cafe", weight: 2 },
  { id: "e2", source: "home", target: "gym", weight: 4 },
  { id: "e3", source: "cafe", target: "office", weight: 5 },
  { id: "e4", source: "cafe", target: "library", weight: 3 },
  { id: "e5", source: "library", target: "station", weight: 4 },
  { id: "e6", source: "gym", target: "office", weight: 3 },
  { id: "e7", source: "gym", target: "park", weight: 6 },
  { id: "e8", source: "office", target: "station", weight: 2 },
  { id: "e9", source: "office", target: "park", weight: 4 },
  { id: "e10", source: "station", target: "hospital", weight: 3 },
  { id: "e11", source: "library", target: "hospital", weight: 7 },
  { id: "e12", source: "park", target: "hospital", weight: 5 }
];
