import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Plus, 
  Edit2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCode,
  Terminal,
  RefreshCw,
  Search,
  ArrowRight
} from 'lucide-react';

interface Delivery {
  deliveryId: number;
  name: string;
  date: string;
  status: string;
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    deliveryId: '',
    name: '',
    date: '',
    status: 'Pending'
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notif, setNotif] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch('/delivery/all');
      const data = await res.json();
      setDeliveries(data);
    } catch (err) {
      console.error("Failed to fetch deliveries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      deliveryId: parseInt(formData.deliveryId),
      name: formData.name,
      date: formData.date,
      status: formData.status
    };

    try {
      if (editingId !== null) {
        const res = await fetch(`/delivery/update/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showNotification("Delivery updated successfully!", 'success');
          setEditingId(null);
        }
      } else {
        const res = await fetch('/delivery/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showNotification("Delivery added successfully!", 'success');
        } else {
          const err = await res.json();
          showNotification(err.error || "Failed to add delivery", 'error');
        }
      }
      setFormData({ deliveryId: '', name: '', date: '', status: 'Pending' });
      fetchDeliveries();
    } catch (err) {
      showNotification("Network error occurred", 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotif({ message, type });
    setTimeout(() => setNotif(null), 3000);
  };

  const startEdit = (d: Delivery) => {
    setEditingId(d.deliveryId);
    setFormData({
      deliveryId: d.deliveryId.toString(),
      name: d.name,
      date: d.date,
      status: d.status
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans selection:bg-[#E4E3E0] selection:text-[#141414]">
      <header className="border-b border-[#141414] p-6 flex justify-between items-center bg-[#E4E3E0]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#141414] text-[#E4E3E0]">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-xs uppercase tracking-widest font-bold font-mono">FSAD Exam Terminal</h1>
            <p className="text-[10px] uppercase opacity-50 font-serif italic">Delivery Management (Spring Boot Simulation)</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1 opacity-60">
            <Clock size={12} /> {new Date().toLocaleDateString()}
          </span>
          <span className="px-2 py-0.5 border border-[#141414] rounded-full uppercase tracking-tighter">
            System Online
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white border border-[#141414] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <Terminal size={100} />
            </div>
            
            <h2 className="text-xl font-serif italic mb-6 flex items-center gap-2">
              {editingId ? "Modify Entry" : "New Delivery Entry"}
              <div className="h-[1px] flex-grow bg-[#141414] opacity-20"></div>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 flex items-center gap-1">
                    Delivery ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    disabled={editingId !== null}
                    required
                    value={formData.deliveryId}
                    onChange={(e) => setFormData({...formData, deliveryId: e.target.value})}
                    placeholder="e.g. 101"
                    className="w-full bg-[#F5F5F5] border border-[#CCCCCC] focus:border-[#141414] p-3 text-sm font-mono outline-none transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider opacity-60">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[#F5F5F5] border border-[#CCCCCC] focus:border-[#141414] p-3 text-sm font-mono outline-none appearance-none cursor-pointer"
                  >
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-60">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                  className="w-full bg-[#F5F5F5] border border-[#CCCCCC] focus:border-[#141414] p-3 text-sm font-mono outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-60">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-[#F5F5F5] border border-[#CCCCCC] focus:border-[#141414] p-3 text-sm font-mono outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#141414] text-white py-4 flex items-center justify-center gap-2 uppercase text-xs font-bold tracking-widest hover:bg-[#333] transition-colors group"
              >
                {editingId ? <RefreshCw size={14} /> : <Plus size={14} />}
                {editingId ? "Update Delivery (PUT)" : "Add Delivery (POST)"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ deliveryId: '', name: '', date: '', status: 'Pending' });
                  }}
                  className="w-full border border-[#141414] py-3 uppercase text-[10px] font-bold tracking-widest hover:bg-[#F5F5F5] transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </section>

          <section className="bg-[#E4E3E0] border border-[#141414] p-8 space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-widest flex items-center gap-2">
              <FileCode size={14} /> Exam Specification
            </h3>
            <ul className="text-xs space-y-3 font-serif italic text-[#444]">
              <li className="flex gap-2">
                <div className="min-w-[4px] h-[4px] bg-[#141414] rounded-full mt-1.5" />
                <span>Package Structure: <code className="bg-white/50 px-1 font-mono not-italic font-bold">com.klef.fsad.exam</code></span>
              </li>
              <li className="flex gap-2">
                <div className="min-w-[4px] h-[4px] bg-[#141414] rounded-full mt-1.5" />
                <span>Database: <code className="bg-white/50 px-1 font-mono not-italic font-bold">fsadendexam</code></span>
              </li>
              <li className="flex gap-2">
                <div className="min-w-[4px] h-[4px] bg-[#141414] rounded-full mt-1.5" />
                <span>Manual ID input required for creation</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white border border-[#141414] h-full min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-[#141414] flex justify-between items-center bg-[#F9F9F9]">
              <h2 className="text-sm uppercase font-bold tracking-widest flex items-center gap-3">
                <Search size={16} /> Delivery Registry
                <span className="bg-[#141414] text-white px-2 py-0.5 text-[8px] rounded uppercase">
                  {deliveries.length} Records
                </span>
              </h2>
              <button 
                onClick={fetchDeliveries}
                className="p-2 hover:bg-[#E4E3E0] transition-colors rounded"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            <div className="flex-grow overflow-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#E4E3E0] border-b border-[#141414] sticky top-0 z-10">
                  <tr className="text-[10px] uppercase font-bold text-[#666]">
                    <th className="text-left p-4 pl-8">ID</th>
                    <th className="text-left p-4">Recipient</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-right p-4 pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E3E0]">
                  <AnimatePresence initial={false}>
                    {deliveries.map((delivery) => (
                      <motion.tr
                        key={delivery.deliveryId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-[#F5F5F5] transition-colors cursor-default"
                      >
                        <td className="p-4 pl-8 font-mono text-xs font-bold">#{delivery.deliveryId}</td>
                        <td className="p-4 text-xs font-medium">{delivery.name}</td>
                        <td className="p-4 text-xs opacity-60 font-mono">{delivery.date}</td>
                        <td className="p-4">
                          <span className={`text-[9px] uppercase px-2 py-0.5 border border-current font-bold
                            ${delivery.status === 'Delivered' ? 'text-green-600' : 
                              delivery.status === 'Shipped' ? 'text-blue-600' : 
                              delivery.status === 'Cancelled' ? 'text-red-500' : 'text-amber-600'}`}
                          >
                            {delivery.status}
                          </span>
                        </td>
                        <td className="p-4 pr-8 text-right">
                          <button
                            onClick={() => startEdit(delivery)}
                            className="p-2 hover:bg-[#141414] hover:text-white transition-all rounded inline-flex items-center gap-1 text-[10px] uppercase font-bold"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {deliveries.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-[#999] italic font-serif">
                        No delivery data found in local simulation database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <AnimatePresence>
              {notif && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className={`p-4 border-t border-[#141414] flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest
                    ${notif.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                >
                  {notif.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {notif.message}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 bg-[#141414] text-[#E4E3E0] text-[8px] uppercase tracking-[0.2em] font-mono flex justify-between items-center">
              <span>Environment: PRODUCTION READY</span>
              <span>Sync Status: Standby</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
