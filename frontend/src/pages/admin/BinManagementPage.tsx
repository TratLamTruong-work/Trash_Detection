import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { binAPI } from '../../services/api';
import type { TrashBinStatus } from '../../services/types';

const statusMeta = {
  empty: {
    label: 'Trống',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
  },
  normal: {
    label: 'Bình thường',
    textColor: 'text-sky-700',
    bgColor: 'bg-sky-100',
  },
  warning: {
    label: 'Cảnh báo',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  full: {
    label: 'Đầy',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-100',
  },
} as const;

const binTypeLabel: Record<string, string> = {
  organic: 'Rác hữu cơ',
  recyclable: 'Rác tái chế',
};

export default function BinManagementPage() {
  const { token } = useAuth();
  const [bins, setBins] = useState<TrashBinStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBins = async (isManualRefresh = false) => {
    if (!token) return;

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await binAPI.getAll(token);
      setBins(response.data || []);
    } catch {
      toast.error('Không thể tải trạng thái thùng rác');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBins();

    const timer = window.setInterval(() => {
      fetchBins(false);
    }, 15000);

    return () => window.clearInterval(timer);
  }, [token]);

  const summary = useMemo(() => {
    const counts = {
      empty: 0,
      normal: 0,
      warning: 0,
      full: 0,
    };

    bins.forEach((bin) => {
      if (bin.status in counts) {
        counts[bin.status as keyof typeof counts] += 1;
      }
    });

    return counts;
  }, [bins]);

  const latestUpdate = useMemo(() => {
    if (bins.length === 0) {
      return null;
    }

    const sorted = [...bins].sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    );

    return sorted[0].lastUpdated;
  }, [bins]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Theo dõi realtime
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý & quan sát thùng rác</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi mức đầy, trạng thái và thời điểm cập nhật của từng thùng rác.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchBins(true)}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium disabled:opacity-70"
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Đang làm mới...' : 'Làm mới'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Tổng thùng</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{bins.length}</p>
          <p className="text-sm text-gray-500 mt-2">Số thùng đang được quản lý</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Bình thường</p>
          <p className="mt-4 text-3xl font-semibold text-sky-700">{summary.normal}</p>
          <p className="text-sm text-gray-500 mt-2">Thùng còn khả năng nhận rác</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Cảnh báo</p>
          <p className="mt-4 text-3xl font-semibold text-amber-700">{summary.warning}</p>
          <p className="text-sm text-gray-500 mt-2">Thùng sắp đầy cần chú ý</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Đầy</p>
          <p className="mt-4 text-3xl font-semibold text-rose-700">{summary.full}</p>
          <p className="text-sm text-gray-500 mt-2">Thùng cần xử lý ngay</p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200 text-center text-gray-500">
          Đang tải dữ liệu thùng rác...
        </div>
      ) : bins.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Trash2 size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Chưa có dữ liệu thùng rác</h2>
          <p className="mt-2 text-gray-500">
            Khi thiết bị gửi trạng thái lên hệ thống, trang này sẽ tự cập nhật và hiển thị tình trạng thực tế.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-2xl bg-white px-5 py-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Cập nhật gần nhất</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {latestUpdate ? new Date(latestUpdate).toLocaleString('vi-VN') : 'Chưa có dữ liệu'}
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {bins.map((bin) => {
              const meta = statusMeta[bin.status];
              return (
                <article
                  key={bin._id}
                  className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Loại thùng</p>
                      <h2 className="text-xl font-semibold text-slate-900 mt-1">
                        {binTypeLabel[bin.binType] ?? bin.binType}
                      </h2>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${meta.bgColor} ${meta.textColor}`}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Mức đầy</span>
                      <span>{bin.currentFillPercent}%</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          bin.status === 'full'
                            ? 'bg-rose-500'
                            : bin.status === 'warning'
                              ? 'bg-amber-400'
                              : bin.status === 'normal'
                                ? 'bg-sky-500'
                                : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, bin.currentFillPercent))}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-gray-50 px-3 py-2">
                      <p className="text-gray-500">Cập nhật lúc</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {new Date(bin.lastUpdated).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 px-3 py-2">
                      <p className="text-gray-500">Trạng thái hệ thống</p>
                      <p className="mt-1 font-semibold text-slate-800">{meta.label}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
