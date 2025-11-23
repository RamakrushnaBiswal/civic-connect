// src/api.ts
export interface Report {
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