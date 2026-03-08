import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import toast from 'react-hot-toast';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_at: string;
}

const TaskList: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const fetchTasks = async (statusFilter: string, targetPage: number) => {
    setIsLoading(true);
    setError('');
    try {
      const endpoint = statusFilter === 'all' 
        ? `/tasks?page=${targetPage}&limit=${limit}` 
        : `/tasks?status=${statusFilter}&page=${targetPage}&limit=${limit}`;
      const response = await axiosInstance.get(endpoint);
      setTasks(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(response.data.page || 1);
    } catch (err: any) {
      const msg = 'Failed to load tasks.';
      setError(msg);
      toast.error(msg);
      if (err?.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filter, page);
  }, [filter, page]);

  const handleFilterChange = (status: string) => {
    setFilter(status);
    setPage(1); // Resetear a la primera página al cambiar el filtro
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleQuickStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated!');
      fetchTasks(filter, page);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight text-blue-900">Datapoint Tasks</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm hidden sm:block">Welcome, {user?.name || 'User'}</span>
              <button 
                onClick={handleLogout}
                className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
          <button 
            onClick={() => navigate('/tasks/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
          >
            + New Task
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6 flex gap-2 overflow-x-auto">
          {['all', 'pending', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {error && <div className="text-red-500 mb-6 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => (
               <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                 <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                 <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                 <div className="flex justify-between">
                   <div className="h-6 bg-gray-200 rounded w-20"></div>
                   <div className="h-6 bg-gray-200 rounded w-20"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
            No tasks found. Create a new task to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 border-l-4 overflow-hidden group flex flex-col"
                style={{ borderLeftColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f97316' : '#3b82f6' }}
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border top-0 ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{task.description}</p>
                  )}
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                   {task.due_date ? (
                     <div className="flex items-center gap-1">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                       <span>{new Date(task.due_date).toLocaleDateString()}</span>
                     </div>
                   ) : <span>No due date</span>}
                   
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     {task.status === 'pending' && (
                       <button 
                         className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors font-medium text-xs" 
                         onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(task.id, 'in_progress'); }}
                         title="Start Progress"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         Start
                       </button>
                     )}
                     {task.status === 'in_progress' && (
                       <button 
                         className="flex items-center gap-1.5 text-green-600 hover:text-green-800 px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-md transition-colors font-medium text-xs" 
                         onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(task.id, 'completed'); }}
                         title="Mark as Completed"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                         Done
                       </button>
                     )}
                     <button 
                       className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors font-medium text-xs" 
                       onClick={(e) => { e.stopPropagation(); navigate(`/tasks/edit/${task.id}`); }}
                       title="Edit Task"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                       Edit
                     </button>
                     <button 
                       className="flex items-center gap-1.5 text-red-600 hover:text-red-800 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 rounded-md transition-colors font-medium text-xs" 
                       title="Delete Task"
                       onClick={async (e) => { 
                       e.stopPropagation();
                       if (window.confirm('Are you sure you want to delete this task?')) {
                         try {
                           await axiosInstance.delete(`/tasks/${task.id}`);
                           toast.success('Task deleted');
                           
                           // Intentar mantener en la misma página, pero si era el último item de la página, retroceder una página
                           const newPage = (tasks.length === 1 && page > 1) ? page - 1 : page;
                           if (newPage !== page) setPage(newPage);
                           else fetchTasks(filter, page);
                         } catch(err) {
                           console.error(err);
                           toast.error('Failed to delete task');
                         }
                       }
                     }}>
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       Delete
                     </button>
                   </div>
                </div>
               </div>
             ))}
           </div>
         )}

         {/* Pagination Controls */}
         {!isLoading && tasks.length > 0 && totalPages > 1 && (
           <div className="flex justify-center items-center gap-4 mt-8 pb-4">
             <button
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               Previous
             </button>
             <span className="text-sm font-medium text-gray-600">
               Page {page} of {totalPages}
             </span>
             <button
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               disabled={page === totalPages}
               className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               Next
             </button>
           </div>
         )}
       </main>
    </div>
  );
};

export default TaskList;
