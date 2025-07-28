import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";

const mockData = {
  stats: {
    totalEstimates: 1247,
    avgCost: 45000,
    popularSelection: "E-commerce Platform",
    processingTime: "2.3 min"
  },
  estimatesByMonth: [
    { month: "Jan", estimates: 89 },
    { month: "Feb", estimates: 124 },
    { month: "Mar", estimates: 156 },
    { month: "Apr", estimates: 203 },
    { month: "May", estimates: 187 },
    { month: "Jun", estimates: 234 }
  ],
  popularSelections: [
    { name: "E-commerce", value: 35, color: "#8884d8" },
    { name: "CRM", value: 25, color: "#82ca9d" },
    { name: "Mobile App", value: 20, color: "#ffc658" },
    { name: "Web App", value: 20, color: "#ff7300" }
  ],
  recentEstimates: [
    { id: 1, type: "E-commerce Platform", industry: "Retail", cost: "$45,000", region: "US", status: "completed" },
    { id: 2, type: "CRM System", industry: "Healthcare", cost: "$78,000", region: "UK", status: "completed" },
    { id: 3, type: "Mobile App", industry: "Fintech", cost: "$62,000", region: "AU", status: "in-progress" },
    { id: 4, type: "Web Application", industry: "Education", cost: "$34,000", region: "IN", status: "completed" },
  ]
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of estimation system performance</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
            <TrendingUp className="h-4 w-4 text-admin-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.totalEstimates.toLocaleString()}</div>
            <p className="text-xs text-admin-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Estimated Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-admin-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockData.stats.avgCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Users className="h-4 w-4 text-admin-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-truncate">{mockData.stats.popularSelection}</div>
            <p className="text-xs text-muted-foreground">35% of all estimates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.processingTime}</div>
            <p className="text-xs text-admin-success">-15% faster</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tech Stack</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tech stack" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stacks</SelectItem>
                  <SelectItem value="react">React/Node.js</SelectItem>
                  <SelectItem value="python">Python/Django</SelectItem>
                  <SelectItem value="mobile">Mobile (React Native)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estimates Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.estimatesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="estimates" fill="hsl(var(--admin-primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Selections</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.popularSelections}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockData.popularSelections.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Estimates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Industry</th>
                  <th className="text-left p-2">Cost</th>
                  <th className="text-left p-2">Region</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentEstimates.map((estimate) => (
                  <tr key={estimate.id} className="border-b">
                    <td className="p-2 font-medium">{estimate.type}</td>
                    <td className="p-2">{estimate.industry}</td>
                    <td className="p-2 font-semibold">{estimate.cost}</td>
                    <td className="p-2">{estimate.region}</td>
                    <td className="p-2">
                      <Badge variant={estimate.status === 'completed' ? 'default' : 'secondary'}>
                        {estimate.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}