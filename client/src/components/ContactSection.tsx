import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Loader2 } from "lucide-react";

// API Integration
import { useCreateContact, useStaticData } from "@/hooks/useApi";
import { CreateContactRequest } from "@/types/api";
import { toast } from "sonner";

const ContactSection = () => {
  const [formData, setFormData] = useState<CreateContactRequest>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });

  // API hooks
  const { data: staticData } = useStaticData();
  const createContactMutation = useCreateContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    try {
      await createContactMutation.mutateAsync(formData);
      // Reset form on success
      setFormData({
        name: "",
        email: "",
        company: "",
        projectType: "",
        message: "",
      });
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Failed to submit contact form:", error);
    }
  };

  const handleInputChange = (field: keyof CreateContactRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get project types from API data or fallback to hardcoded list
  const projectTypes = staticData?.softwareTypes.map(type => type.name) || [
    "Web App",
    "Mobile App",
    "SaaS Platform",
    "ERP System",
    "Marketplace",
    "CRM System",
    "Other",
  ];

  const isLoading = createContactMutation.isPending;

  return (
    <section className="py-20 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 gradient-text">
            Let's Build Something Amazing
          </h2>
          {/* <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your gaming project? Get in touch and let's discuss
            how we can bring your vision to life.
          </p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="card-gaming">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24
                hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Your full name"
                      className="transition-all duration-300 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="your@email.com"
                      className="transition-all duration-300 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      placeholder="Your company name"
                      className="transition-all duration-300 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) =>
                        handleInputChange("projectType", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded-md transition-all duration-300 focus:border-primary focus:outline-none"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Details</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    placeholder="Tell us about your project requirements, timeline, and budget..."
                    rows={5}
                    className="transition-all duration-300 focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gaming"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="card-gaming">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-secondary" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      estimation@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+44 208 0901819</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">Unit 2 Hobbs Court, 2 Jacob Street, London SE1 2BG</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="card-gaming-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-casino-green" />
                  Quick Response Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Initial Response</span>
                  <Badge className="bg-casino-green text-white">
                    Within 2 hours
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Detailed Proposal</span>
                  <Badge className="bg-primary text-white">
                    Within 24 hours
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Project Kickoff</span>
                  <Badge className="bg-secondary text-secondary-foreground">
                    Within 1 week
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="card-gaming border-primary/50">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Ready to Start?</h3>
                <p className="text-muted-foreground mb-6">
                  Book a free 30-minute consultation to discuss your project.
                </p>
                <Button variant="gaming-secondary" size="lg" className="w-full">
                  Schedule Free Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;