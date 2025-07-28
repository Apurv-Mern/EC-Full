import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter } from "lucide-react";
import vrImage from "@/assets/vr-portfolio.jpg";
import casinoImage from "@/assets/casino-portfolio.jpg";
import aiImage from "@/assets/ai-portfolio.jpg";

const portfolioItems = [
  {
    id: 1,
    title: "Virgin VR Experience",
    category: "VR",
    description: "Immersive virtual reality experience with cutting-edge graphics and haptic feedback.",
    image: vrImage,
    technologies: ["Unity", "VR", "C#", "Oculus"],
    status: "Live"
  },
  {
    id: 2,
    title: "Ultimate Poker Tournament",
    category: "Casino",
    description: "Real-money poker platform with advanced AI opponents and tournament systems.",
    image: casinoImage,
    technologies: ["React", "Node.js", "WebRTC", "AI"],
    status: "Live"
  },
  {
    id: 3,
    title: "AI Game Assistant",
    category: "AI",
    description: "Advanced AI system for procedural content generation and player behavior analysis.",
    image: aiImage,
    technologies: ["Python", "TensorFlow", "OpenAI", "Redis"],
    status: "Development"
  },
  {
    id: 4,
    title: "Strawberry Smash Mobile",
    category: "Mobile",
    description: "Fast-paced match-3 game with social features and in-app purchases.",
    image: casinoImage,
    technologies: ["React Native", "Firebase", "Unity", "Analytics"],
    status: "Live"
  },
  {
    id: 5,
    title: "MRI Medical Simulator",
    category: "VR",
    description: "Professional medical training simulator for MRI procedures.",
    image: vrImage,
    technologies: ["Unreal", "VR", "Medical APIs", "Training"],
    status: "Live"
  },
  {
    id: 6,
    title: "Race the Leader",
    category: "Mobile",
    description: "Multiplayer racing game with real-time competition and leaderboards.",
    image: aiImage,
    technologies: ["Unity", "Multiplayer", "Cloud", "Mobile"],
    status: "Live"
  }
];

const categories = ["All", "VR", "Casino", "AI", "Mobile"];

const PortfolioSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = portfolioItems.filter(item => 
    selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 gradient-text">
            Our Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing our expertise across VR experiences, casino platforms, AI solutions, and mobile games.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "gaming" : "gaming-outline"}
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card-gaming group cursor-pointer overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={item.status === "Live" ? "default" : "secondary"}
                    className={item.status === "Live" ? "bg-casino-green text-white" : ""}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="gaming">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <Badge variant="outline" className="text-primary border-primary">
                    {item.category}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Button variant="gaming-outline" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;