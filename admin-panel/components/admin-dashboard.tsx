"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  LogOut,
  AlertTriangle,
  Clock,
  FileText,
  Search,
  Filter,
  Eye,
  MessageSquare,
  CheckSquare,
  AlertCircle,
  ArrowUp,
  Settings,
  Zap,
  UserPlus,
  Calendar,
  BarChart3,
  Send,
  History,
  User,
} from "lucide-react"

interface AdminDashboardProps {
  user: { name: string; role: string } | null
  onLogout: () => void
}

const personnel = [
  {
    id: "p001",
    name: "Mike Johnson",
    role: "Senior Technician",
    department: "public-works",
    email: "mike.johnson@city.gov",
    phone: "(555) 101-2001",
    availability: "Available",
    currentWorkload: 3,
    maxWorkload: 8,
    skills: ["Electrical", "Street Lighting", "Traffic Signals"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "p002",
    name: "Sarah Chen",
    role: "Maintenance Supervisor",
    department: "road-maintenance",
    email: "sarah.chen@city.gov",
    phone: "(555) 101-2002",
    availability: "Busy",
    currentWorkload: 7,
    maxWorkload: 8,
    skills: ["Road Repair", "Pothole Filling", "Asphalt Work"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "p003",
    name: "David Rodriguez",
    role: "Sanitation Coordinator",
    department: "sanitation",
    email: "david.rodriguez@city.gov",
    phone: "(555) 101-2003",
    availability: "Available",
    currentWorkload: 2,
    maxWorkload: 6,
    skills: ["Waste Collection", "Route Planning", "Equipment Maintenance"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "p004",
    name: "Lisa Thompson",
    role: "Code Enforcement Officer",
    department: "code-enforcement",
    email: "lisa.thompson@city.gov",
    phone: "(555) 101-2004",
    availability: "On Leave",
    currentWorkload: 0,
    maxWorkload: 5,
    skills: ["Noise Violations", "Building Codes", "Permit Inspection"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "p005",
    name: "James Wilson",
    role: "Parks Maintenance",
    department: "parks-recreation",
    email: "james.wilson@city.gov",
    phone: "(555) 101-2005",
    availability: "Available",
    currentWorkload: 4,
    maxWorkload: 7,
    skills: ["Landscaping", "Equipment Repair", "Facility Maintenance"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const assignmentHistory = [
  {
    id: "ah001",
    complaintId: "C001",
    assignedTo: "Mike Johnson",
    assignedBy: "Admin",
    assignedDate: "2024-01-16",
    status: "Active",
    notes: "Assigned based on electrical expertise and availability",
  },
  {
    id: "ah002",
    complaintId: "C003",
    assignedTo: "Sarah Chen",
    assignedBy: "Admin",
    assignedDate: "2024-01-13",
    status: "Completed",
    notes: "Completed ahead of schedule",
  },
  {
    id: "ah003",
    complaintId: "C002",
    assignedTo: "Unassigned",
    assignedBy: "System",
    assignedDate: "2024-01-14",
    status: "Pending",
    notes: "Awaiting department assignment",
  },
]

const mockComplaints = [
  {
    id: "C001",
    title: "Broken streetlight on Main St",
    description:
      "The streetlight at the intersection of Main St and Oak Ave has been out for 3 days. This creates a safety hazard for pedestrians and drivers, especially during evening hours.",
    category: "Infrastructure",
    priority: "High",
    status: "In Progress",
    citizen: "John Smith",
    citizenEmail: "john.smith@email.com",
    citizenPhone: "(555) 123-4567",
    date: "2024-01-15",
    assignedTo: "Mike Johnson",
    assignedPersonnelId: "p001",
    assignedDate: "2024-01-16",
    location: "Main St & Oak Ave intersection",
    images: ["/broken-streetlight.png"],
    escalated: false,
    slaDeadline: "2024-01-20",
    departmentId: "public-works",
    autoRouted: true,
    workflowStage: "repair-scheduled",
    updates: [
      { date: "2024-01-16", message: "Assigned to Mike Johnson", author: "Admin" },
      { date: "2024-01-17", message: "Work order created, scheduled for repair", author: "Mike Johnson" },
    ],
  },
  {
    id: "C002",
    title: "Garbage collection missed",
    description:
      "Our garbage was not collected on the scheduled pickup day (Tuesday). This is the second time this month. The bins are overflowing and attracting pests.",
    category: "Sanitation",
    priority: "Medium",
    status: "Pending",
    citizen: "Mary Johnson",
    citizenEmail: "mary.johnson@email.com",
    citizenPhone: "(555) 987-6543",
    date: "2024-01-14",
    assignedTo: "Unassigned",
    assignedPersonnelId: null,
    assignedDate: null,
    location: "123 Elm Street",
    images: ["/overflowing-garbage-bins.png"],
    escalated: true,
    slaDeadline: "2024-01-18",
    departmentId: null,
    autoRouted: false,
    workflowStage: "pending-assignment",
    updates: [],
  },
  {
    id: "C003",
    title: "Pothole on Oak Avenue",
    description:
      "Large pothole causing damage to vehicles. Multiple cars have reported tire damage. The hole is approximately 2 feet wide and 6 inches deep.",
    category: "Road Maintenance",
    priority: "High",
    status: "Completed",
    citizen: "Robert Davis",
    citizenEmail: "robert.davis@email.com",
    citizenPhone: "(555) 456-7890",
    date: "2024-01-13",
    assignedTo: "Sarah Chen",
    assignedPersonnelId: "p002",
    assignedDate: "2024-01-13",
    location: "Oak Avenue, near house #456",
    images: ["/large-pothole-in-road.png"],
    escalated: false,
    slaDeadline: "2024-01-18",
    departmentId: "road-maintenance",
    autoRouted: true,
    workflowStage: "completed",
    updates: [
      { date: "2024-01-13", message: "Assigned to Sarah Chen", author: "Admin" },
      { date: "2024-01-14", message: "Repair crew dispatched", author: "Sarah Chen" },
      { date: "2024-01-15", message: "Pothole filled and road surface restored", author: "Sarah Chen" },
    ],
  },
  {
    id: "C004",
    title: "Noise complaint - Construction",
    description:
      "Construction work starting at 6 AM violates city noise ordinance. Work should not begin before 7 AM on weekdays.",
    category: "Noise",
    priority: "Low",
    status: "Pending",
    citizen: "Sarah Wilson",
    citizenEmail: "sarah.wilson@email.com",
    citizenPhone: "(555) 234-5678",
    date: "2024-01-12",
    assignedTo: "Unassigned",
    assignedPersonnelId: null,
    assignedDate: null,
    location: "Construction site at 789 Pine Street",
    images: [],
    escalated: false,
    slaDeadline: "2024-01-22",
    departmentId: null,
    autoRouted: false,
    workflowStage: "pending-review",
    updates: [],
  },
]

const departments = [
  { id: "public-works", name: "Public Works Department", categories: ["Infrastructure", "Utilities"] },
  { id: "sanitation", name: "Sanitation Department", categories: ["Sanitation", "Waste Management"] },
  { id: "road-maintenance", name: "Road Maintenance", categories: ["Road Maintenance", "Transportation"] },
  { id: "code-enforcement", name: "Code Enforcement", categories: ["Noise", "Building Violations"] },
  { id: "parks-recreation", name: "Parks & Recreation", categories: ["Parks", "Recreation"] },
]

const workflowStages = {
  "pending-review": "Pending Review",
  "pending-assignment": "Pending Assignment",
  assigned: "Assigned",
  "in-progress": "In Progress",
  "repair-scheduled": "Repair Scheduled",
  completed: "Completed",
  escalated: "Escalated",
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<(typeof mockComplaints)[0] | null>(null)
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("")
  const [showEscalationDialog, setShowEscalationDialog] = useState(false)
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false)
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false)
  const [assignmentComplaint, setAssignmentComplaint] = useState<(typeof mockComplaints)[0] | null>(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState("")
  const [assignmentNotes, setAssignmentNotes] = useState("")

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.citizen.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedComplaints(filteredComplaints.map((c) => c.id))
    } else {
      setSelectedComplaints([])
    }
  }

  const handleSelectComplaint = (complaintId: string, checked: boolean) => {
    if (checked) {
      setSelectedComplaints([...selectedComplaints, complaintId])
    } else {
      setSelectedComplaints(selectedComplaints.filter((id) => id !== complaintId))
    }
  }

  const handleBulkAction = () => {
    if (bulkAction && selectedComplaints.length > 0) {
      console.log(`Performing bulk action: ${bulkAction} on complaints:`, selectedComplaints)
      // In a real app, this would make API calls
      setSelectedComplaints([])
      setBulkAction("")
    }
  }

  const handleEscalateComplaint = (complaintId: string) => {
    console.log(`Escalating complaint: ${complaintId}`)
    // In a real app, this would make an API call
  }

  const handleAutoRoute = (complaintId: string) => {
    const complaint = mockComplaints.find((c) => c.id === complaintId)
    if (complaint) {
      const suggestedDept = departments.find((dept) => dept.categories.includes(complaint.category))
      console.log(`Auto-routing complaint ${complaintId} to ${suggestedDept?.name}`)
    }
  }

  const handleAssignComplaint = (complaint: (typeof mockComplaints)[0]) => {
    setAssignmentComplaint(complaint)
    setShowAssignmentDialog(true)
  }

  const handleSubmitAssignment = () => {
    if (assignmentComplaint && selectedPersonnel) {
      const person = personnel.find((p) => p.id === selectedPersonnel)
      console.log(`Assigning complaint ${assignmentComplaint.id} to ${person?.name}`)
      console.log(`Assignment notes: ${assignmentNotes}`)
      // In a real app, this would make an API call
      setShowAssignmentDialog(false)
      setAssignmentComplaint(null)
      setSelectedPersonnel("")
      setAssignmentNotes("")
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Busy":
        return "bg-yellow-100 text-yellow-800"
      case "On Leave":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-orange-100 text-orange-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating complaint ${complaintId} to status: ${newStatus}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Municipal Admin</h1>
                <p className="text-sm text-muted-foreground">Complaint Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">247</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">23</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Escalated Issues</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">8</div>
                  <p className="text-xs text-muted-foreground">Urgent attention needed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Auto-Routed</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <p className="text-xs text-muted-foreground">Automatically assigned</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Complaints */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Recent Complaints</CardTitle>
                <CardDescription>Latest citizen feedback requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockComplaints.slice(0, 3).map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{complaint.id}</Badge>
                          <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                          <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                          {complaint.escalated && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Escalated
                            </Badge>
                          )}
                          {complaint.autoRouted && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto-Routed
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-foreground">{complaint.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {complaint.category} • Reported by {complaint.citizen} • {complaint.date}
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Filter & Search Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Sanitation">Sanitation</SelectItem>
                      <SelectItem value="Road Maintenance">Road Maintenance</SelectItem>
                      <SelectItem value="Noise">Noise</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setCategoryFilter("all")
                      setPriorityFilter("all")
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {selectedComplaints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Bulk Operations</CardTitle>
                  <CardDescription>{selectedComplaints.length} complaints selected</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select bulk action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assign-department">Assign to Department</SelectItem>
                        <SelectItem value="update-status">Update Status</SelectItem>
                        <SelectItem value="update-priority">Update Priority</SelectItem>
                        <SelectItem value="escalate">Escalate Issues</SelectItem>
                        <SelectItem value="auto-route">Auto-Route</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleBulkAction} disabled={!bulkAction}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Apply to {selectedComplaints.length} items
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedComplaints([])}>
                      Clear Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">All Complaints ({filteredComplaints.length})</CardTitle>
                <CardDescription>Manage and review citizen complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Checkbox
                      checked={selectedComplaints.length === filteredComplaints.length && filteredComplaints.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label className="text-sm font-medium">Select All ({filteredComplaints.length} items)</Label>
                  </div>

                  {filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedComplaints.includes(complaint.id)}
                        onCheckedChange={(checked) => handleSelectComplaint(complaint.id, checked as boolean)}
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{complaint.id}</Badge>
                          <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                          <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                          {complaint.escalated && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Escalated
                            </Badge>
                          )}
                          {complaint.autoRouted && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto-Routed
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {workflowStages[complaint.workflowStage as keyof typeof workflowStages]}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-foreground">{complaint.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {complaint.category} • {complaint.citizen} • {complaint.date}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Location: {complaint.location} • Assigned to: {complaint.assignedTo}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">SLA Deadline: {complaint.slaDeadline}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                        </Dialog>

                        {complaint.assignedTo === "Unassigned" && (
                          <Button variant="outline" size="sm" onClick={() => handleAssignComplaint(complaint)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign
                          </Button>
                        )}

                        {!complaint.escalated && (
                          <Button variant="outline" size="sm" onClick={() => handleEscalateComplaint(complaint.id)}>
                            <ArrowUp className="h-4 w-4 mr-2" />
                            Escalate
                          </Button>
                        )}

                        {!complaint.autoRouted && !complaint.assignedTo.includes("Unassigned") && (
                          <Button variant="outline" size="sm" onClick={() => handleAutoRoute(complaint.id)}>
                            <Zap className="h-4 w-4 mr-2" />
                            Auto-Route
                          </Button>
                        )}

                        <Select onValueChange={(value) => handleStatusUpdate(complaint.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Personnel Directory</CardTitle>
                    <CardDescription>Manage department staff and their assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {personnel.map((person) => (
                        <div
                          key={person.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                              <AvatarFallback>
                                {person.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-foreground">{person.name}</h4>
                                <Badge className={getAvailabilityColor(person.availability)}>
                                  {person.availability}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{person.role}</p>
                              <p className="text-xs text-muted-foreground">
                                {departments.find((d) => d.id === person.department)?.name}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-muted-foreground">Workload:</span>
                                <Progress
                                  value={(person.currentWorkload / person.maxWorkload) * 100}
                                  className="w-20 h-2"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {person.currentWorkload}/{person.maxWorkload}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <User className="h-4 w-4 mr-2" />
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Assignment History</CardTitle>
                    <CardDescription>Track assignment changes and completion history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {assignmentHistory.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline">{assignment.complaintId}</Badge>
                              <Badge className={getStatusColor(assignment.status)}>{assignment.status}</Badge>
                            </div>
                            <p className="text-sm font-medium">Assigned to: {assignment.assignedTo}</p>
                            <p className="text-xs text-muted-foreground">
                              By {assignment.assignedBy} on {assignment.assignedDate}
                            </p>
                            {assignment.notes && (
                              <p className="text-xs text-muted-foreground mt-1">Notes: {assignment.notes}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Department Workload</CardTitle>
                    <CardDescription>Current assignment distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departments.map((dept) => {
                        const deptPersonnel = personnel.filter((p) => p.department === dept.id)
                        const totalWorkload = deptPersonnel.reduce((sum, p) => sum + p.currentWorkload, 0)
                        const maxCapacity = deptPersonnel.reduce((sum, p) => sum + p.maxWorkload, 0)
                        const utilizationRate = maxCapacity > 0 ? (totalWorkload / maxCapacity) * 100 : 0

                        return (
                          <div key={dept.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium">{dept.name}</h4>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(utilizationRate)}% utilized
                              </span>
                            </div>
                            <Progress value={utilizationRate} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{deptPersonnel.length} staff</span>
                              <span>
                                {totalWorkload}/{maxCapacity} tasks
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New Personnel
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Workload Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Assignment Rules
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Management
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Progress Reports</CardTitle>
                <CardDescription>Monitor task progress and generate reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Progress tracking and reporting features will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Assign Task</DialogTitle>
            <DialogDescription>Assign complaint {assignmentComplaint?.id} to a department personnel</DialogDescription>
          </DialogHeader>

          {assignmentComplaint && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{assignmentComplaint.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{assignmentComplaint.description}</p>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(assignmentComplaint.priority)}>
                    {assignmentComplaint.priority}
                  </Badge>
                  <Badge variant="outline">{assignmentComplaint.category}</Badge>
                  <span className="text-xs text-muted-foreground">SLA: {assignmentComplaint.slaDeadline}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Select Personnel</Label>
                  <Select value={selectedPersonnel} onValueChange={setSelectedPersonnel}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a person to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {personnel
                        .filter((p) => p.availability !== "On Leave")
                        .filter((p) => {
                          const dept = departments.find((d) => d.id === p.department)
                          return dept?.categories.includes(assignmentComplaint.category)
                        })
                        .map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            <div className="flex items-center space-x-2">
                              <span>{person.name}</span>
                              <Badge className={getAvailabilityColor(person.availability)} variant="secondary">
                                {person.availability}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                ({person.currentWorkload}/{person.maxWorkload})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPersonnel && (
                  <div className="p-3 bg-muted rounded-lg">
                    {(() => {
                      const person = personnel.find((p) => p.id === selectedPersonnel)
                      return person ? (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                              <AvatarFallback>
                                {person.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{person.name}</p>
                              <p className="text-xs text-muted-foreground">{person.role}</p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <p>Skills: {person.skills.join(", ")}</p>
                            <p>
                              Contact: {person.email} | {person.phone}
                            </p>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Assignment Notes</Label>
                  <Textarea
                    placeholder="Add any special instructions or notes for this assignment..."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAssignmentDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitAssignment} disabled={!selectedPersonnel}>
                    <Send className="h-4 w-4 mr-2" />
                    Assign Task
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Complaint Details - {selectedComplaint.id}</DialogTitle>
                <DialogDescription>
                  Submitted by {selectedComplaint.citizen} on {selectedComplaint.date}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.title}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <Badge className={getPriorityColor(selectedComplaint.priority)} variant="secondary">
                        {selectedComplaint.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedComplaint.status)} variant="secondary">
                        {selectedComplaint.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Assigned To</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.assignedTo}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.location}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Citizen Information</Label>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground">Name: {selectedComplaint.citizen}</p>
                      <p className="text-sm text-muted-foreground">Email: {selectedComplaint.citizenEmail}</p>
                      <p className="text-sm text-muted-foreground">Phone: {selectedComplaint.citizenPhone}</p>
                    </div>
                  </div>

                  {selectedComplaint.images.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Attached Images</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {selectedComplaint.images.map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Complaint image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">Progress Updates</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {selectedComplaint.updates.length > 0 ? (
                        selectedComplaint.updates.map((update, index) => (
                          <div key={index} className="p-3 bg-muted rounded-md">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-medium">{update.author}</span>
                              <span className="text-xs text-muted-foreground">{update.date}</span>
                            </div>
                            <p className="text-sm">{update.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No updates yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Add Update</Label>
                    <Textarea placeholder="Enter progress update..." className="mt-2" rows={3} />
                    <Button size="sm" className="mt-2">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Update
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
