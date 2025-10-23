import React from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { Building2, Users, UserCog, BedDouble, Activity, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { wards, patients, staff } = useApp();

  // Calculate statistics
  const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
  const occupiedBeds = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0);
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

  const activePatients = patients.filter(p => p.status !== 'Discharged').length;
  const criticalPatients = patients.filter(p => p.status === 'Critical').length;
  const activeStaff = staff.filter(s => s.status === 'Active').length;

  // Ward occupancy data for chart
  const wardData = wards.map(ward => ({
    name: ward.name,
    occupied: ward.occupiedBeds,
    available: ward.availableBeds,
  }));

  // Patient status distribution
  const statusData = [
    { name: 'Admitted', value: patients.filter(p => p.status === 'Admitted').length },
    { name: 'Critical', value: patients.filter(p => p.status === 'Critical').length },
    { name: 'Stable', value: patients.filter(p => p.status === 'Stable').length },
    { name: 'Recovering', value: patients.filter(p => p.status === 'Recovering').length },
  ].filter(item => item.value > 0);

  const COLORS = ['#0ea5e9', '#ef4444', '#10b981', '#f59e0b'];

  // Recent patients
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of hospital ward management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Wards"
          value={wards.length}
          icon={Building2}
          color="blue"
          subtitle={`${totalBeds} total beds`}
        />
        <StatCard
          title="Active Patients"
          value={activePatients}
          icon={Users}
          color="green"
          subtitle={`${criticalPatients} critical`}
        />
        <StatCard
          title="Available Beds"
          value={availableBeds}
          icon={BedDouble}
          color="yellow"
          subtitle={`${occupancyRate}% occupancy`}
        />
        <StatCard
          title="Active Staff"
          value={activeStaff}
          icon={UserCog}
          color="purple"
          subtitle={`${staff.length} total staff`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward Occupancy Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ward Occupancy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wardData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupied" fill="#0ea5e9" name="Occupied" />
              <Bar dataKey="available" fill="#10b981" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Admissions</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ward
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPatients.map((patient) => {
                const ward = wards.find(w => w.id === patient.wardId);
                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.bedNumber}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {ward?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {patient.diagnosis}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${patient.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                          patient.status === 'Stable' ? 'bg-green-100 text-green-800' : 
                          patient.status === 'Recovering' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {patient.doctor}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      {criticalPatients > 0 && (
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-900">Critical Patients Alert</h4>
              <p className="text-sm text-red-700 mt-1">
                There are {criticalPatients} patient(s) in critical condition requiring immediate attention.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
