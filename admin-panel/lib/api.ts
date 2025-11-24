// src/api.ts
export interface Report {
  id?: string;
  escalated?: boolean;
  assignedTo: string;
  workflowStage: string;
  status: string;
  priority: any;
  phone: any;
  email: any;
  photo: any;
  location: any;
  category: any;
  name: string;
  createdAt: any;
  _id: string;
  title: string;
  description: string;
  date: string;
}

export const fetchReports = async (): Promise<Report[]> => {
  try {
    const response = await fetch('http://localhost:5000/api/reports/show-reports');
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    const data = await response.json();
    return data.reports || data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const updateReport = async (_id: string, updates: Record<string, any>) => {
  try {
    const response = await fetch(`http://localhost:5000/api/reports/reports/${_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Failed to update report: ${response.status} ${text}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating report:', error)
    throw error
  }
}

export const assignReport = async (_id: string, payload: { assignedTo?: string; note?: string; assignedBy?: string; assignedPersonnelId?: string }) => {
  try {
    const response = await fetch(`http://localhost:5000/api/reports/reports/${_id}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Failed to assign report: ${response.status} ${text}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error assigning report:', error)
    throw error
  }
}

export const fetchPersonnel = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/personnel');
    if (!res.ok) throw new Error('Failed to fetch personnel');
    const data = await res.json();
    return data.personnel || [];
  } catch (err) {
    console.error('Error fetching personnel:', err);
    return [];
  }
}

export const updatePersonnel = async (id: string, updates: Record<string, any>) => {
  try {
    const res = await fetch(`http://localhost:5000/api/personnel/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates)
    })
    if (!res.ok) throw new Error('Failed to update personnel')
    return res.json()
  } catch (err) { console.error(err); throw err }
}

export const changeWorkload = async (id: string, delta: number) => {
  try {
    const res = await fetch(`http://localhost:5000/api/personnel/${id}/workload`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delta })
    })
    if (!res.ok) throw new Error('Failed to change workload')
    return res.json()
  } catch (err) { console.error(err); throw err }
}

export const seedPersonnel = async (personnel: any[]) => {
  try {
    const res = await fetch('http://localhost:5000/api/personnel/seed', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ personnel })
    })
    if (!res.ok) throw new Error('Failed to seed personnel')
    return res.json()
  } catch (err) { console.error(err); throw err }
}

export const unassignReport = async (_id: string, payload: { note?: string; unassignedBy?: string } = {}) => {
  try {
    const response = await fetch(`http://localhost:5000/api/reports/reports/${_id}/unassign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Failed to unassign report: ${response.status} ${text}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error unassigning report:', error)
    throw error
  }
}
export const createPersonnel = async (payload: Record<string, any>) => {
  try {
    const res = await fetch('http://localhost:5000/api/personnel', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to create personnel: ${res.status} ${text}`)
    }
    return res.json()
  } catch (err) { console.error(err); throw err }
}

export const fetchFeedbacks = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/feedback');
    if (!res.ok) throw new Error('Failed to fetch feedbacks');
    const data = await res.json();
    return data.feedbacks || [];
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    return [];
  }
}

export const addFeedbackComment = async (id: string, payload: { author?: string; message: string; resolved?: boolean; resolutionNotes?: string }) => {
  try {
    const res = await fetch(`http://localhost:5000/api/feedback/${id}/comment`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to add comment: ${res.status} ${text}`)
    }
    return res.json()
  } catch (err) { console.error(err); throw err }
}