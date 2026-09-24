import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Shield } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/admin/all');
        if (res.data.success) setUsers(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Registered Customers</h1>
        <p className="text-xs text-slate-500">Customer profiles, total orders count, and account creation dates</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Orders Placed</th>
              <th className="py-3 px-4">Registered Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-[11px] text-slate-400">{u.email}</div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {u.phone || 'Not provided'}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-indigo-600">
                  {u._count?.orders || 0}
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">
                  {formatDate(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
