import React, { useEffect, useState } from 'react';
import { Clock, User, Activity, FileText, Loader2, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Fetch
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('system_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        if (isMounted) {
          setLogs(data || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchLogs();

    // 2. Realtime Subscription
    const channel = supabase
      .channel('system_logs_monitor')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_logs' },
        (payload) => {
          if (isMounted) {
            setLogs((prevLogs) => [payload.new, ...prevLogs]);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      // Safely remove channel, catching error if socket closed
      supabase.removeChannel(channel).catch(() => {
        // Silent catch for production cleanup
      });
    };
  }, []);

  // Helper to format date nicely
  const formatDate = (isoString: string) => {
    if (!isoString) return { date: '-', time: '-' };
    const date = new Date(isoString);
    return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  return (
    <div className="space-y-8 animate-slide-up">
       <div className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
            <FileText className="text-red-500" size={24} />
            <h2 className="text-lg md:text-xl font-mono text-white tracking-[0.15em] uppercase">ROOT / LOGS</h2>
        </div>
        <p className="text-xs text-red-500/60 font-mono tracking-wider ml-0 md:ml-9">Real-time system activity monitor including IP tracing.</p>
      </div>

      <div className="border border-neutral-800 bg-dark-800 relative rounded-sm overflow-hidden min-h-[500px]">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500 z-10"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500 z-10"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500 z-10"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500 z-10"></div>

        <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
                <thead>
                    <tr className="bg-dark-700 border-b border-neutral-800">
                        <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] w-40 opacity-80">Timestamp</th>
                        <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] w-48 opacity-80">User</th>
                        <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] w-40 opacity-80">IP Address</th>
                        <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] w-40 opacity-80">Action</th>
                        <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                    {loading ? (
                         <tr>
                            <td colSpan={5} className="py-20 text-center text-red-500 font-mono tracking-widest">
                                <div className="flex justify-center items-center gap-2">
                                    <Loader2 className="animate-spin" /> CONNECTING_STREAM...
                                </div>
                            </td>
                        </tr>
                    ) : logs.length > 0 ? (
                        logs.map((log) => {
                            const { date, time } = formatDate(log.timestamp);
                            return (
                                <tr key={log.id} className="hover:bg-red-500/5 transition-colors animate-in fade-in slide-in-from-top-1">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs">
                                            <Clock size={12} className="text-red-500" />
                                            <span className="text-red-500/80">{date} <span className="text-neutral-700 mx-1">|</span> {time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-white font-mono text-xs">
                                            <User size={12} className="text-red-500" />
                                            <span className="tracking-wider">{log.user_email?.split('@')[0].toUpperCase() || 'SYSTEM'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
                                            <Globe size={12} className="text-neutral-600" />
                                            <span className="tracking-wide">{log.ip_address || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-white font-mono text-xs">
                                            <Activity size={12} className="text-neutral-600" />
                                            <span className="text-neutral-300 uppercase">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-neutral-500">
                                        {log.details}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-20 text-center text-neutral-600 font-mono text-xs tracking-widest uppercase">
                                NO LOGS RECORDED
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;