import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileText, Image, Save, Eye } from "lucide-react";

interface ContentPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: "landing" | "how-it-works" | "about" | "pricing" | "faq";
  isPublished: boolean;
  lastModified: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

interface SiteAsset {
  id: number;
  name: string;
  type: "logo" | "hero-image" | "icon" | "other";
  url: string;
  description: string;
  uploadedAt: string;
}

const mockContentPages: ContentPage[] = [
  {
    id: 1,
    title: "Landing Page Hero",
    slug: "hero",
    content: "Get accurate project estimates in minutes. Our AI-powered platform analyzes your requirements and provides detailed cost breakdowns for software development projects.",
    type: "landing",
    isPublished: true,
    lastModified: "2024-01-15 10:30"
  },
  {
    id: 2,
    title: "How It Works",
    slug: "how-it-works",
    content: "1. Describe your project\n2. Select features and requirements\n3. Choose your region and timeline\n4. Get instant detailed estimates",
    type: "how-it-works",
    isPublished: true,
    lastModified: "2024-01-14 16:20"
  },
  {
    id: 3,
    title: "About Us",
    slug: "about",
    content: "We're a team of experienced developers and project managers who understand the challenges of software estimation...",
    type: "about",
    isPublished: false,
    lastModified: "2024-01-13 09:15"
  }
];

const mockFAQs: FAQ[] = [
  {
    id: 1,
    question: "How accurate are the cost estimates?",
    answer: "Our estimates are based on industry standards and real project data, typically accurate within 15-20% of actual costs.",
    category: "Accuracy",
    order: 1,
    isPublished: true
  },
  {
    id: 2,
    question: "What regions do you support?",
    answer: "We currently support United States, United Kingdom, Australia, and India with region-specific pricing.",
    category: "General",
    order: 2,
    isPublished: true
  },
  {
    id: 3,
    question: "Can I customize the features list?",
    answer: "Yes, our admin panel allows you to add, edit, and configure features with custom pricing.",
    category: "Features",
    order: 3,
    isPublished: true
  }
];

const mockAssets: SiteAsset[] = [
  {
    id: 1,
    name: "Main Logo",
    type: "logo",
    url: "/assets/logo.png",
    description: "Primary brand logo",
    uploadedAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Hero Background",
    type: "hero-image",
    url: "/assets/hero-bg.jpg",
    description: "Landing page hero background image",
    uploadedAt: "2024-01-15"
  }
];

export default function Content() {
  const [contentPages, setContentPages] = useState<ContentPage[]>(mockContentPages);
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [assets, setAssets] = useState<SiteAsset[]>(mockAssets);
  const [activeTab, setActiveTab] = useState("pages");
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingAsset, setEditingAsset] = useState<SiteAsset | null>(null);
  const { toast } = useToast();

  const [pageFormData, setPageFormData] = useState({
    title: "",
    slug: "",
    content: "",
    type: "landing" as ContentPage["type"],
    isPublished: true
  });

  const [faqFormData, setFaqFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    order: 1,
    isPublished: true
  });

  const [assetFormData, setAssetFormData] = useState({
    name: "",
    type: "other" as SiteAsset["type"],
    url: "",
    description: ""
  });

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPage) {
      setContentPages(prev => prev.map(page =>
        page.id === editingPage.id
          ? { ...page, ...pageFormData, lastModified: new Date().toLocaleString() }
          : page
      ));
      toast({ title: "Content page updated successfully" });
    } else {
      const newPage: ContentPage = {
        id: Math.max(...contentPages.map(p => p.id)) + 1,
        ...pageFormData,
        lastModified: new Date().toLocaleString()
      };
      setContentPages(prev => [...prev, newPage]);
      toast({ title: "Content page created successfully" });
    }

    resetPageForm();
    setIsPageDialogOpen(false);
  };

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingFaq) {
      setFaqs(prev => prev.map(faq =>
        faq.id === editingFaq.id ? { ...faq, ...faqFormData } : faq
      ));
      toast({ title: "FAQ updated successfully" });
    } else {
      const newFaq: FAQ = {
        id: Math.max(...faqs.map(f => f.id)) + 1,
        ...faqFormData
      };
      setFaqs(prev => [...prev, newFaq]);
      toast({ title: "FAQ created successfully" });
    }

    resetFaqForm();
    setIsFaqDialogOpen(false);
  };

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAsset) {
      setAssets(prev => prev.map(asset =>
        asset.id === editingAsset.id ? { ...asset, ...assetFormData } : asset
      ));
      toast({ title: "Asset updated successfully" });
    } else {
      const newAsset: SiteAsset = {
        id: Math.max(...assets.map(a => a.id)) + 1,
        ...assetFormData,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      setAssets(prev => [...prev, newAsset]);
      toast({ title: "Asset created successfully" });
    }

    resetAssetForm();
    setIsAssetDialogOpen(false);
  };

  const handleEditPage = (page: ContentPage) => {
    setPageFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      type: page.type,
      isPublished: page.isPublished
    });
    setEditingPage(page);
    setIsPageDialogOpen(true);
  };

  const handleEditFaq = (faq: FAQ) => {
    setFaqFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isPublished: faq.isPublished
    });
    setEditingFaq(faq);
    setIsFaqDialogOpen(true);
  };

  const handleEditAsset = (asset: SiteAsset) => {
    setAssetFormData({
      name: asset.name,
      type: asset.type,
      url: asset.url,
      description: asset.description
    });
    setEditingAsset(asset);
    setIsAssetDialogOpen(true);
  };

  const handleDeletePage = (id: number) => {
    setContentPages(prev => prev.filter(page => page.id !== id));
    toast({ title: "Content page deleted successfully" });
  };

  const handleDeleteFaq = (id: number) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    toast({ title: "FAQ deleted successfully" });
  };

  const handleDeleteAsset = (id: number) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
    toast({ title: "Asset deleted successfully" });
  };

  const resetPageForm = () => {
    setPageFormData({
      title: "",
      slug: "",
      content: "",
      type: "landing",
      isPublished: true
    });
    setEditingPage(null);
  };

  const resetFaqForm = () => {
    setFaqFormData({
      question: "",
      answer: "",
      category: "General",
      order: 1,
      isPublished: true
    });
    setEditingFaq(null);
  };

  const resetAssetForm = () => {
    setAssetFormData({
      name: "",
      type: "other",
      url: "",
      description: ""
    });
    setEditingAsset(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "landing": return "bg-blue-500";
      case "how-it-works": return "bg-green-500";
      case "about": return "bg-purple-500";
      case "pricing": return "bg-orange-500";
      case "faq": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">Manage website content, FAQs, and assets</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pages">Content Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        {/* Content Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Content Pages</h2>
            <Dialog open={isPageDialogOpen} onOpenChange={(open) => {
              setIsPageDialogOpen(open);
              if (!open) resetPageForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPage ? "Edit Content Page" : "Add New Content Page"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePageSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Page Title</Label>
                      <Input
                        id="title"
                        value={pageFormData.title}
                        onChange={(e) => setPageFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter page title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={pageFormData.slug}
                        onChange={(e) => setPageFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="page-url-slug"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Page Type</Label>
                    <select
                      id="type"
                      value={pageFormData.type}
                      onChange={(e) => setPageFormData(prev => ({ ...prev, type: e.target.value as ContentPage["type"] }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="landing">Landing</option>
                      <option value="how-it-works">How It Works</option>
                      <option value="about">About</option>
                      <option value="pricing">Pricing</option>
                      <option value="faq">FAQ</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={pageFormData.content}
                      onChange={(e) => setPageFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter page content (supports markdown)"
                      rows={10}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={pageFormData.isPublished}
                      onChange={(e) => setPageFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isPublished">Published</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {editingPage ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetPageForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {contentPages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-admin-primary" />
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <Badge variant="secondary" className={getTypeColor(page.type)}>
                        {page.type}
                      </Badge>
                      <Badge variant={page.isPublished ? "default" : "secondary"}>
                        {page.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPage(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePage(page.id)}
                        className="text-admin-danger hover:text-admin-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Content Preview</p>
                      <p className="text-sm line-clamp-3">{page.content}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Slug</p>
                      <p className="text-sm font-mono">/{page.slug}</p>
                      <p className="text-sm font-medium text-muted-foreground mt-2">Last Modified</p>
                      <p className="text-sm">{page.lastModified}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <Dialog open={isFaqDialogOpen} onOpenChange={(open) => {
              setIsFaqDialogOpen(open);
              if (!open) resetFaqForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFaqSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Input
                      id="question"
                      value={faqFormData.question}
                      onChange={(e) => setFaqFormData(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter the question"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea
                      id="answer"
                      value={faqFormData.answer}
                      onChange={(e) => setFaqFormData(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Enter the answer"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={faqFormData.category}
                        onChange={(e) => setFaqFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="General, Features, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="order">Order</Label>
                      <Input
                        id="order"
                        type="number"
                        min="1"
                        value={faqFormData.order}
                        onChange={(e) => setFaqFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="faqIsPublished"
                      checked={faqFormData.isPublished}
                      onChange={(e) => setFaqFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="faqIsPublished">Published</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingFaq ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetFaqForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {faqs
              .sort((a, b) => a.order - b.order)
              .map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                        <Badge variant="outline">{faq.category}</Badge>
                        <Badge variant="outline">#{faq.order}</Badge>
                        <Badge variant={faq.isPublished ? "default" : "secondary"}>
                          {faq.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFaq(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="text-admin-danger hover:text-admin-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Site Assets</h2>
            <Dialog open={isAssetDialogOpen} onOpenChange={(open) => {
              setIsAssetDialogOpen(open);
              if (!open) resetAssetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAssetSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="assetName">Asset Name</Label>
                    <Input
                      id="assetName"
                      value={assetFormData.name}
                      onChange={(e) => setAssetFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter asset name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="assetType">Asset Type</Label>
                    <select
                      id="assetType"
                      value={assetFormData.type}
                      onChange={(e) => setAssetFormData(prev => ({ ...prev, type: e.target.value as SiteAsset["type"] }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="logo">Logo</option>
                      <option value="hero-image">Hero Image</option>
                      <option value="icon">Icon</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="assetUrl">URL</Label>
                    <Input
                      id="assetUrl"
                      value={assetFormData.url}
                      onChange={(e) => setAssetFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="/assets/image.png"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="assetDescription">Description</Label>
                    <Textarea
                      id="assetDescription"
                      value={assetFormData.description}
                      onChange={(e) => setAssetFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the asset"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingAsset ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetAssetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {assets.map((asset) => (
              <Card key={asset.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image className="h-5 w-5 text-admin-primary" />
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                      <Badge variant="outline">{asset.type}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAsset(asset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-admin-danger hover:text-admin-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">URL</p>
                      <p className="text-sm font-mono">{asset.url}</p>
                    </div>
                    {asset.description && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="text-sm">{asset.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Uploaded</p>
                      <p className="text-sm">{asset.uploadedAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}