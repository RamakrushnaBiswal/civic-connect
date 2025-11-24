"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import BoringAvatar from "boring-avatars";
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
import { fetchReports, updateReport, assignReport, fetchPersonnel, unassignReport, createPersonnel, updatePersonnel, fetchFeedbacks } from "@/lib/api"

interface AdminDashboardProps {
  user: { name: string; role: string } | null
  onLogout: () => void
}

interface Personnel {
  id: string
  name: string
  role?: string
  department?: string
  availability?: string
  currentWorkload?: number
  maxWorkload?: number
  avatar?: string
  email?: string
  phone?: string
  skills?: string[]
}

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
    status: "resolved",
    notes: "resolved ahead of schedule",
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

type Complaint = {
  id: string
  title: string
  description: string
  createdAt: string
  category: string
  name?: string
  email?: string
  phone?: string
  priority?: string
  status?: string
  escalated?: boolean
  autoRouted?: boolean
  workflowStage?: string
  location?: string
  assignedTo?: string
  assignedPersonnelId?: string
  slaDeadline?: string
  photo?: string
  updates?: { author: string; date: string; message: string }[]
}

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
  resolved: "resolved",
  escalated: "Escalated",
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [feedbacks, setFeedbacks] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const p = await fetchPersonnel()
        if (mounted && Array.isArray(p)) setPersonnel(p)
      } catch (err) {
        console.error('Failed to fetch personnel', err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  // Add personnel dialog state and form
  const [showAddPersonnelDialog, setShowAddPersonnelDialog] = useState(false)
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newDepartment, setNewDepartment] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newAvailability, setNewAvailability] = useState("Available")
  const [newMaxWorkload, setNewMaxWorkload] = useState<number>(8)
  const [newSkills, setNewSkills] = useState("")

  const handleCreatePersonnel = async () => {
    if (!newName.trim()) return
    const payload = {
      name: newName.trim(),
      role: newRole.trim() || undefined,
      department: newDepartment || undefined,
      email: newEmail || undefined,
      phone: newPhone || undefined,
      availability: newAvailability || undefined,
      maxWorkload: Number(newMaxWorkload) || 8,
      skills: newSkills ? newSkills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    }

    try {
      const res = await createPersonnel(payload)
      const person = res && (res.person || res)
      if (person) {
        // refresh personnel list
        const refreshed = await fetchPersonnel()
        if (Array.isArray(refreshed)) setPersonnel(refreshed)
      }
      // reset and close
      setNewName("")
      setNewRole("")
      setNewDepartment("")
      setNewEmail("")
      setNewPhone("")
      setNewAvailability("Available")
      setNewMaxWorkload(8)
      setNewSkills("")
      setShowAddPersonnelDialog(false)
    } catch (err) {
      console.error('Failed to create personnel', err)
    }
  }

  const mapReportToComplaint = (report: any): Complaint => ({
    id: report.id || report._id,
    title: report.title,
    description: report.description,
    createdAt: report.createdAt || report.date || new Date().toISOString(),
    category: report.category,
    name: report.name,
    priority: report.priority,
    email: report.email,
    phone: report.phone,
    status: report.status || "Pending",
    escalated: !!report.escalated,
    workflowStage: report.workflowStage || "pending-review",
    location: report.location,
    assignedTo: report.assignedTo || (report.assignedPersonnelId ? (personnel.find((p) => p.id === report.assignedPersonnelId)?.name) : "Unassigned") || "Unassigned",
    assignedPersonnelId: report.assignedPersonnelId || null,
    slaDeadline: "",
    photo: report.photo,
    updates: report.updates || [],
  })

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const reports = await fetchReports()
          const mapped: Complaint[] = reports.map(mapReportToComplaint)
          // console.log("Fetched and mapped reports:", mapped)
          if (mounted) setComplaints(mapped)
        } catch (err) {
          console.error(err)
        }
      })()

      ; (async () => {
        try {
          const f = await fetchFeedbacks()
          if (mounted && Array.isArray(f)) setFeedbacks(f)
        } catch (err) {
          console.error('Failed to fetch feedbacks', err)
        }
      })()

    return () => {
      mounted = false
    }
  }, [])
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("")
  const [showEscalationDialog, setShowEscalationDialog] = useState(false)
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false)
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false)
  const [assignmentComplaint, setAssignmentComplaint] = useState<Complaint | null>(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState("")
  const [assignmentNotes, setAssignmentNotes] = useState("")
  const [newUpdateText, setNewUpdateText] = useState("")
  // View / Edit personnel dialog state
  const [showViewPersonDialog, setShowViewPersonDialog] = useState(false)
  const [showEditPersonDialog, setShowEditPersonDialog] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null)

  // Edit form fields
  const [editName, setEditName] = useState("")
  const [editRole, setEditRole] = useState("")
  const [editDepartment, setEditDepartment] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editAvailability, setEditAvailability] = useState("")
  const [editMaxWorkload, setEditMaxWorkload] = useState<number>(8)
  const [editSkills, setEditSkills] = useState("")

  const filteredComplaints = complaints.filter((complaint: any) => {
    const matchesSearch =
      (complaint.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.citizen || '').toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleToggleEscalation = async (complaintId: string, currentlyEscalated?: boolean) => {
    const newValue = !currentlyEscalated
    // console.log(`${newValue ? 'Escalating' : 'De-escalating'} complaint: ${complaintId}`)
    // Optimistic UI update
    setComplaints((prev) => prev.map((c) => (c.id === complaintId ? { ...c, escalated: newValue } : c)))

    try {
      await updateReport(complaintId, { escalated: newValue })
      // console.log(`Escalation updated on server for ${complaintId}: ${newValue}`)
    } catch (err) {
      console.error('Failed to update escalation on server, reverting UI change', err)
      // Revert optimistic update
      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? { ...c, escalated: currentlyEscalated } : c)))
    }
  }


  const handleAssignComplaint = (complaint: Complaint) => {
    setAssignmentComplaint(complaint)
    setShowAssignmentDialog(true)
  }

  const handleSubmitAssignment = () => {
    ;(async () => {
      if (!(assignmentComplaint && selectedPersonnel)) return

      const person = personnel.find((p) => p.id === selectedPersonnel)
      const assigneeName = person?.name || selectedPersonnel
      const complaintId = assignmentComplaint.id

      // optimistic UI
      const prevComplaints = complaints
      const prevSelected = assignmentComplaint

      const optimistic = { ...assignmentComplaint, assignedTo: assigneeName, updates: [...(assignmentComplaint.updates || []), { author: user?.name || 'Admin', date: new Date().toISOString(), message: `Assigned to ${assigneeName}` }] }
      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? optimistic : c)))
      setShowAssignmentDialog(false)
      setAssignmentComplaint(null)
      setSelectedPersonnel("")
      setAssignmentNotes("")

      try {
        const res = await assignReport(complaintId, { assignedTo: assigneeName, note: assignmentNotes, assignedBy: user?.name, assignedPersonnelId: selectedPersonnel })
        const updatedReport = (res && (res.report || res)) || null
        if (updatedReport) {
          const updatedComplaint = mapReportToComplaint(updatedReport)
          setComplaints((prev) => prev.map((c) => (c.id === complaintId ? updatedComplaint : c)))
          // refresh personnel list so workload changes are visible immediately
          try {
            const refreshed = await fetchPersonnel()
            if (Array.isArray(refreshed)) setPersonnel(refreshed)
          } catch (pf) {
            console.warn('Failed to refresh personnel after assignment', pf)
          }
        }
      } catch (err) {
        console.error('Failed to assign on server, reverting', err)
        setComplaints(prevComplaints)
      }
    })()
  }

  const handleUnassignAssignment = () => {
    ;(async () => {
      if (!assignmentComplaint) return

      const complaintId = assignmentComplaint.id

      // optimistic UI: mark as unassigned locally
      const prevComplaints = complaints
      const prevAssignment = assignmentComplaint
      const optimistic = { ...assignmentComplaint, assignedTo: 'Unassigned', updates: [...(assignmentComplaint.updates || []), { author: user?.name || 'Admin', date: new Date().toISOString(), message: `Unassigned` }] }
      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? optimistic : c)))

      try {
        const res = await unassignReport(complaintId, { unassignedBy: user?.name })
        const updatedReport = (res && (res.report || res)) || null
        if (updatedReport) {
          const updatedComplaint = mapReportToComplaint(updatedReport)
          setComplaints((prev) => prev.map((c) => (c.id === complaintId ? updatedComplaint : c)))
          // refresh personnel list
          try {
            const refreshed = await fetchPersonnel()
            if (Array.isArray(refreshed)) setPersonnel(refreshed)
          } catch (pf) {
            console.warn('Failed to refresh personnel after unassign', pf)
          }
        }
      } catch (err) {
        console.error('Failed to unassign on server, reverting', err)
        setComplaints(prevComplaints)
        // restore selection
        setAssignmentComplaint(prevAssignment)
      }
    })()
  }

  // Unassign a specific complaint directly from the list
  const handleUnassignComplaint = (complaint: Complaint) => {
    ;(async () => {
      const complaintId = complaint.id
      const prevComplaints = complaints

      const optimistic = {
        ...complaint,
        assignedTo: 'Unassigned',
        assignedPersonnelId: undefined,
        updates: [...(complaint.updates || []), { author: user?.name || 'Admin', date: new Date().toISOString(), message: `Unassigned` }],
      }

      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? optimistic : c)))

      try {
        const res = await unassignReport(complaintId, { unassignedBy: user?.name })
        const updatedReport = (res && (res.report || res)) || null
        if (updatedReport) {
          const updatedComplaint = mapReportToComplaint(updatedReport)
          setComplaints((prev) => prev.map((c) => (c.id === complaintId ? updatedComplaint : c)))
          try {
            const refreshed = await fetchPersonnel()
            if (Array.isArray(refreshed)) setPersonnel(refreshed)
          } catch (pf) {
            console.warn('Failed to refresh personnel after unassign', pf)
          }
        }
      } catch (err) {
        console.error('Failed to unassign on server, reverting', err)
        setComplaints(prevComplaints)
      }
    })()
  }

  const handleAddUpdate = async () => {
    if (!selectedComplaint || !newUpdateText.trim()) return

    const complaintId = selectedComplaint.id
    const author = user?.name || "Admin"
    const newUpdate = { author, date: new Date().toISOString(), message: newUpdateText.trim() }

    // Keep previous state to revert if needed
    const prevSelected = selectedComplaint
    const prevComplaints = complaints

    // Optimistic UI update: add update locally
    const optimisticSelected: Complaint = {
      ...selectedComplaint,
      updates: [...(selectedComplaint.updates || []), newUpdate],
    }
    setSelectedComplaint(optimisticSelected)
    setComplaints((prev) => prev.map((c) => (c.id === complaintId ? optimisticSelected : c)))
    setNewUpdateText("")

    try {
      const res = await updateReport(complaintId, { updates: optimisticSelected.updates })
      const updatedReport = (res && (res.report || res)) || null
      if (updatedReport) {
        const updatedComplaint = mapReportToComplaint(updatedReport)
        setSelectedComplaint(updatedComplaint)
        setComplaints((prev) => prev.map((c) => (c.id === complaintId ? updatedComplaint : c)))
      }
    } catch (err) {
      console.error("Failed to add update:", err)
      // revert
      setSelectedComplaint(prevSelected)
      setComplaints(prevComplaints)
      // restore text so admin can retry
      setNewUpdateText(newUpdate.message)
    }
  }

  const handleUpdatePersonnelSubmit = async () => {
    if (!selectedPerson) return
    const id = selectedPerson.id
    const payload: Record<string, any> = {
      name: editName.trim(),
      role: editRole || undefined,
      department: editDepartment || undefined,
      email: editEmail || undefined,
      phone: editPhone || undefined,
      availability: editAvailability || undefined,
      maxWorkload: Number(editMaxWorkload) || 8,
      skills: editSkills ? editSkills.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
    }

    try {
      const res = await updatePersonnel(id, payload)
      const person = (res && (res.person || res)) || null
      if (person) {
        // refresh list
        try {
          const refreshed = await fetchPersonnel()
          if (Array.isArray(refreshed)) setPersonnel(refreshed)
        } catch (pf) {
          console.warn('Failed to refresh personnel after update', pf)
        }
        setSelectedPerson(person)
        setShowEditPersonDialog(false)
      }
    } catch (err) {
      console.error('Failed to update personnel', err)
    }
  }

  const getAvailabilityColor = (availability?: string) => {
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
      case "resolved":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-500 text-blue-700"
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

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    // Map UI status values to backend expected values if needed
    const statusMap: Record<string, string> = {
      "Pending": "pending",
      "In Progress": "in progress",
      "resolved": "resolved",
      "Resolved": "resolved",
      "Closed": "closed",
    }

    const backendStatus = statusMap[newStatus] || newStatus

    // Find current value to allow revert on failure
    const prev = complaints.find((c) => c.id === complaintId)
    const prevStatus = prev?.status

    // Optimistic UI update (show human-friendly label)
    setComplaints((prevList) => prevList.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c)))

    try {
      const res = await updateReport(complaintId, { status: backendStatus })
      // backend may return updated report in res.report or res.report
      const updatedReport = (res && (res.report || res)) || null
      if (updatedReport) {
        const updatedComplaint = mapReportToComplaint(updatedReport)
        setComplaints((prevList) => prevList.map((c) => (c.id === complaintId ? updatedComplaint : c)))
      }
    } catch (err) {
      console.error(`Failed to update status for ${complaintId}`, err)
      // revert
      setComplaints((prevList) => prevList.map((c) => (c.id === complaintId ? { ...c, status: prevStatus || "Pending" } : c)))
    }
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
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
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
                  <div className="text-2xl font-bold text-primary">{complaints.length}</div>
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
                  {complaints.slice(0, 3).map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{complaint.id}</Badge>
                          <Badge className={getPriorityColor(complaint.priority || "")}>{complaint.priority}</Badge>
                          <Badge className={getStatusColor(complaint.status || "")}>{complaint.status}</Badge>
                          {complaint.escalated && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Escalated
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-foreground">{complaint.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {complaint.category} • Reported by {complaint.name} • {new Date(complaint.createdAt).toLocaleDateString()}
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
                      <SelectItem value="resolved">resolved</SelectItem>
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
                          <Badge className={getPriorityColor(complaint.priority || "")}>{complaint.priority}</Badge>
                          <Badge className={getStatusColor(complaint.status || "")}>{complaint.status}</Badge>
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
                          {complaint.category} • {complaint.name} • {new Date(complaint.createdAt).toLocaleDateString()}.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Location: {complaint.location} • Assigned to: {complaint.assignedTo}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          SLA Deadline: {new Date(new Date(complaint.createdAt).setDate(new Date(complaint.createdAt).getDate() + 3)).toLocaleDateString()}
                        </p>

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

                        <Button
                          variant={complaint.escalated ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleToggleEscalation(complaint.id, complaint.escalated)}
                        >
                          <ArrowUp className="h-4 w-4 mr-2" />
                          {complaint.escalated ? "De-escalate" : "Escalate"}
                        </Button>


                        <Select onValueChange={(value) => handleStatusUpdate(complaint.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="resolved">resolved</SelectItem>
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
                              <BoringAvatar name={person.name} variant="pixel"/>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-foreground">{person.name}</h4>
                                <Badge className={getAvailabilityColor(person.availability)}>
                                  {person.availability || "Unknown"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{person.role}</p>
                              <p className="text-xs text-muted-foreground">
                                {departments.find((d) => d.id === person.department)?.name}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-muted-foreground">Workload:</span>
                                <Progress
                                  value={((person.currentWorkload || 0) / (person.maxWorkload || 1)) * 100}
                                  className="w-20 h-2"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {person.currentWorkload || 0}/{person.maxWorkload || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedPerson(person); setShowViewPersonDialog(true) }}>
                              <User className="h-4 w-4 mr-2" />
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              // open edit dialog and prefill
                              setSelectedPerson(person)
                              setEditName(person.name || "")
                              setEditRole(person.role || "")
                              setEditDepartment(person.department || "")
                              setEditEmail(person.email || "")
                              setEditPhone(person.phone || "")
                              setEditAvailability(person.availability || "Available")
                              setEditMaxWorkload(person.maxWorkload || 8)
                              setEditSkills((person.skills || []).join(", "))
                              setShowEditPersonDialog(true)
                            }}>
                              <Calendar className="h-4 w-4 mr-2" />
                              Update
                            </Button>
                            {/* Unassign All removed — use per-complaint unassign instead */}
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
                        const totalWorkload = deptPersonnel.reduce((sum, p) => sum + (p.currentWorkload || 0), 0)
                        const maxCapacity = deptPersonnel.reduce((sum, p) => sum + (p.maxWorkload || 0), 0)
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
                    <Dialog open={showAddPersonnelDialog} onOpenChange={setShowAddPersonnelDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add New Personnel
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-serif">Add New Personnel</DialogTitle>
                          <DialogDescription>Add a new staff member to the personnel directory</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div>
                            <Label>Name</Label>
                            <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Department</Label>
                            <Select onValueChange={setNewDepartment}>
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Availability</Label>
                            <Select onValueChange={setNewAvailability}>
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Availability" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Busy">Busy</SelectItem>
                                <SelectItem value="On Leave">On Leave</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Max Workload</Label>
                            <Input type="number" value={String(newMaxWorkload)} onChange={(e) => setNewMaxWorkload(Number(e.target.value))} className="mt-1" />
                          </div>
                          <div>
                            <Label>Skills (comma-separated)</Label>
                            <Input value={newSkills} onChange={(e) => setNewSkills(e.target.value)} className="mt-1" />
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setShowAddPersonnelDialog(false)}>Cancel</Button>
                            <Button onClick={handleCreatePersonnel}>Create</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">User Feedback</CardTitle>
                <CardDescription>Feedback submitted by citizens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbacks.length === 0 ? (
                    <p className="text-muted-foreground">No feedback available.</p>
                  ) : (
                    feedbacks.map((fb) => (
                      <div key={fb.id || fb._id} className="p-3 border border-border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{fb.name} {fb.rating ? (<span className="text-sm text-muted-foreground">• {fb.rating}⭐</span>) : null}</h4>
                            <p className="text-sm text-muted-foreground">{fb.email || '—'}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(fb.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-sm">{fb.message}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline" onClick={async () => {
                            try {
                              const res = await fetch(`http://localhost:5000/api/feedback/${fb.id}/resolve`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resolutionNotes: 'Marked resolved by admin' }) })
                              if (res.ok) {
                                const json = await res.json()
                                setFeedbacks((prev) => prev.map((p) => (p.id === fb.id ? json.feedback : p)))
                              }
                            } catch (err) { console.error(err) }
                          }}>{fb.resolved ? 'Resolved' : 'Mark Resolved'}</Button>

                          <Button size="sm" variant="outline" onClick={async () => {
                            const comment = prompt('Enter comment to send to user:')
                            if (!comment) return
                            const markResolved = confirm('Mark this feedback as resolved?')
                            try {
                              const res = await fetch(`http://localhost:5000/api/feedback/${fb.id}/comment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author: user?.name || 'Admin', message: comment, resolved: markResolved, resolutionNotes: markResolved ? 'Resolved by admin via comment' : undefined }) })
                              if (res.ok) {
                                const json = await res.json()
                                setFeedbacks((prev) => prev.map((p) => (p.id === fb.id ? json.feedback : p)))
                                alert('Comment sent and user notified (if email available).')
                              }
                            } catch (err) { console.error(err); alert('Failed to add comment') }
                          }}>Comment</Button>

                          <Button size="sm" variant="destructive" onClick={async () => {
                            if (!confirm('Delete this feedback?')) return
                            try {
                              const res = await fetch(`http://localhost:5000/api/feedback/${fb.id}`, { method: 'DELETE' })
                              if (res.ok) setFeedbacks((prev) => prev.filter((p) => p.id !== fb.id))
                            } catch (err) { console.error(err) }
                          }}>Delete</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
                  <Badge className={getPriorityColor(assignmentComplaint?.priority || "")}>
                    {assignmentComplaint?.priority}
                  </Badge>
                  <Badge variant="outline">{assignmentComplaint.category}</Badge>
                  <span className="text-xs text-muted-foreground">SLA: {new Date(new Date(assignmentComplaint.createdAt).setDate(new Date(assignmentComplaint.createdAt).getDate() + 3)).toLocaleDateString()}</span>
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
                        {(() => {
                          const available = personnel.filter((p) => p.availability !== "On Leave")
                          const category = assignmentComplaint?.category
                          const filtered = category
                            ? available.filter((p) => departments.find((d) => d.id === p.department)?.categories.includes(category))
                            : available
                          const list = filtered.length ? filtered : available
                          return list.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              <div className="flex items-center space-x-2">
                                <span>{person.name}</span>
                                <Badge className={getAvailabilityColor(person.availability)} variant="secondary">
                                  {person.availability || "Unknown"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ({person.currentWorkload || 0}/{person.maxWorkload || 0})
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        })()}
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
                              <BoringAvatar name={person.name} variant="pixel" />
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{person.name}</p>
                              <p className="text-xs text-muted-foreground">{person.role}</p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <p>Skills: {person.skills?.join(", ") || "—"}</p>
                            <p>
                              Contact: {person.email || "—"} | {person.phone || "—"}
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
                  <Button variant="destructive" onClick={handleUnassignAssignment} disabled={!assignmentComplaint || assignmentComplaint.assignedTo === 'Unassigned'}>
                    Unassign
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
                  Submitted by {selectedComplaint.name} on {new Date(selectedComplaint.createdAt).toLocaleDateString()}
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
                      <Badge className={getPriorityColor(selectedComplaint?.priority || "")} variant="secondary">
                        {selectedComplaint?.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedComplaint?.status || "")} variant="secondary">
                        {selectedComplaint?.status}
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
                      <p className="text-sm text-muted-foreground">Name: {selectedComplaint.name}</p>
                      <p className="text-sm text-muted-foreground">Email: {selectedComplaint.email}</p>
                      <p className="text-sm text-muted-foreground">Phone: {selectedComplaint.phone}</p>
                    </div>
                  </div>

                  {selectedComplaint.photo && (
                    <div>
                      <Label className="text-sm font-medium">Attached Images</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <img src={selectedComplaint.photo}  className="w-full h-28 object-cover rounded-md border" />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">Progress Updates</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {selectedComplaint.updates && selectedComplaint.updates.length > 0 ? (
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
                    <Textarea
                      placeholder="Enter progress update..."
                      className="mt-2"
                      rows={3}
                      value={newUpdateText}
                      onChange={(e) => setNewUpdateText((e.target as HTMLTextAreaElement).value)}
                    />
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" onClick={handleAddUpdate} disabled={!newUpdateText.trim()}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Update
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setNewUpdateText("")}>Cancel</Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
        {/* View Personnel Dialog */}
        <Dialog open={showViewPersonDialog} onOpenChange={(open) => { if (!open) setSelectedPerson(null); setShowViewPersonDialog(open) }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif">Personnel Profile</DialogTitle>
              <DialogDescription>Details for {selectedPerson?.name}</DialogDescription>
            </DialogHeader>
            {selectedPerson && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <BoringAvatar name={selectedPerson.name} variant="pixel" />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedPerson.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedPerson.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <Label className="text-xs">Department</Label>
                    <p className="text-sm text-muted-foreground">{departments.find((d) => d.id === selectedPerson.department)?.name || selectedPerson.department || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Contact</Label>
                    <p className="text-sm text-muted-foreground">{selectedPerson.email || '—'} • {selectedPerson.phone || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Availability</Label>
                    <p className="text-sm text-muted-foreground">{selectedPerson.availability || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Workload</Label>
                    <p className="text-sm text-muted-foreground">{selectedPerson.currentWorkload || 0}/{selectedPerson.maxWorkload || 0}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Skills</Label>
                    <p className="text-sm text-muted-foreground">{(selectedPerson.skills || []).join(', ') || '—'}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShowViewPersonDialog(false)}>Close</Button>
                  <Button onClick={() => { setShowViewPersonDialog(false); setShowEditPersonDialog(true);
                      // prefill edit fields
                      setEditName(selectedPerson.name || ''); setEditRole(selectedPerson.role || ''); setEditDepartment(selectedPerson.department || ''); setEditEmail(selectedPerson.email || ''); setEditPhone(selectedPerson.phone || ''); setEditAvailability(selectedPerson.availability || 'Available'); setEditMaxWorkload(selectedPerson.maxWorkload || 8); setEditSkills((selectedPerson.skills || []).join(', '))
                    }}>Edit</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Personnel Dialog */}
        <Dialog open={showEditPersonDialog} onOpenChange={(open) => { if (!open) setSelectedPerson(null); setShowEditPersonDialog(open) }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif">Update Personnel</DialogTitle>
              <DialogDescription>Modify staff details</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={editRole} onChange={(e) => setEditRole(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Department</Label>
                <Select value={editDepartment} onValueChange={setEditDepartment}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Email</Label>
                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Availability</Label>
                <Select value={editAvailability} onValueChange={setEditAvailability}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Max Workload</Label>
                <Input type="number" value={String(editMaxWorkload)} onChange={(e) => setEditMaxWorkload(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label>Skills (comma-separated)</Label>
                <Input value={editSkills} onChange={(e) => setEditSkills(e.target.value)} className="mt-1" />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowEditPersonDialog(false)}>Cancel</Button>
                <Button onClick={handleUpdatePersonnelSubmit}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  )
}
