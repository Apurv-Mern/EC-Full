import { Button } from "@/components/ui/button";
import { ChevronDown, Gamepad2, Zap, Users } from "lucide-react";
import heroImage from "@/assets/hero-gaming.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary/20 rounded-full float-animation" />
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-secondary/30 rounded-full float-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-primary-glow/20 rounded-full float-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-neon-cyan/40 rounded-full float-animation" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text text-shadow-glow">
            Game Development
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Redefined
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Creating immersive casino games, cutting-edge VR experiences, and AI-powered gaming solutions 
            that push the boundaries of interactive entertainment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button variant="gaming" size="xl" className="group">
            <Gamepad2 className="mr-2 group-hover:rotate-12 transition-transform" />
            View Portfolio
          </Button>
          <Button variant="gaming-outline" size="xl" className="group">
            <Zap className="mr-2 group-hover:scale-110 transition-transform" />
            Get Quote
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          <div className="card-gaming-glow text-center p-6">
            <div className="text-4xl font-bold gradient-text mb-2">50+</div>
            <div className="text-muted-foreground">Games Developed</div>
          </div>
          <div className="card-gaming-glow text-center p-6">
            <div className="text-4xl font-bold gradient-text mb-2">100K+</div>
            <div className="text-muted-foreground">Active Players</div>
          </div>
          <div className="card-gaming-glow text-center p-6">
            <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce-slow">
          <ChevronDown className="w-8 h-8 text-primary mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;