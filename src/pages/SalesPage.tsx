import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Metric = {
  id: string;
  title: string;
  value: string;
  helperText: string;
  trend: "up" | "down" | "flat";
};

type PipelineStage = {
  id: string;
  title: string;
  count: number;
  value: number;
  color: string;
};

type Activity = {
  id: string;
  time: string;
  user: string;
  stage: string;
  amount: string;
  type: "deal" | "meeting" | "followup";
};

type Insight = {
  id: string;
  label: string;
  change: string;
  description: string;
  direction: "up" | "down";
};

const RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Quarter to date", value: "qtd" },
  { label: "Year to date", value: "ytd" },
];

const SalesPage = () => {
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState<string>("30d");

  const summaryMetrics = useMemo<Metric[]>(
    () => [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "৳ 5.4M",
        helperText: "12.4% vs previous period",
        trend: "up",
      },
      {
        id: "avg-deal",
        title: "Average Deal Size",
        value: "৳ 82.4K",
        helperText: "2.1% vs previous period",
        trend: "up",
      },
      {
        id: "conversion",
        title: "Win Rate",
        value: "38.5%",
        helperText: "3.6% vs previous period",
        trend: "up",
      },
      {
        id: "cycle",
        title: "Sales Cycle",
        value: "24 days",
        helperText: "1.2 days slower",
        trend: "down",
      },
    ],
    [selectedRange]
  );

  const pipelineStages = useMemo<PipelineStage[]>(
    () => [
      {
        id: "qualification",
        title: "Qualification",
        count: 42,
        value: 1800000,
        color: "bg-blue-500",
      },
      {
        id: "proposal",
        title: "Proposal",
        count: 28,
        value: 1450000,
        color: "bg-indigo-500",
      },
      {
        id: "negotiation",
        title: "Negotiation",
        count: 18,
        value: 980000,
        color: "bg-purple-500",
      },
      {
        id: "closed",
        title: "Closed Won",
        count: 12,
        value: 860000,
        color: "bg-emerald-500",
      },
    ],
    []
  );

  const recentActivities = useMemo<Activity[]>(
    () => [
      {
        id: "1",
        time: "9:25 AM",
        user: "Tanvir Rahman",
        stage: "Closed Won — ଢ৳ 320,000",
        amount: "৳ 320K",
        type: "deal",
      },
      {
        id: "2",
        time: "10:05 AM",
        user: "Mahira Akter",
        stage: "Demo Scheduled",
        amount: "Tomorrow 2:00 PM",
        type: "meeting",
      },
      {
        id: "3",
        time: "11:40 AM",
        user: "Arif Chowdhury",
        stage: "Negotiation — RFP sent",
        amount: "৳ 210K",
        type: "followup",
      },
      {
        id: "4",
        time: "1:15 PM",
        user: "Nusrat Jahan",
        stage: "Discovery Call Completed",
        amount: "New lead: Tech Hive",
        type: "deal",
      },
    ],
    []
  );

  const performanceInsights = useMemo<Insight[]>(
    () => [
      {
        id: "velocity",
        label: "Velocity",
        change: "+18%",
        description: "Deals are moving faster through the pipeline this month",
        direction: "up",
      },
      {
        id: "followups",
        label: "Follow-ups",
        change: "-6%",
        description: "Follow-up completion dipped this week. Review queue.",
        direction: "down",
      },
      {
        id: "quota",
        label: "Quota Coverage",
        change: "82%",
        description: "On track for the quarter with six weeks remaining",
        direction: "up",
      },
    ],
    []
  );

  const totalPipelineValue = useMemo(
    () => pipelineStages.reduce((sum, stage) => sum + stage.value, 0),
    [pipelineStages]
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: value >= 1000000 ? 0 : 1,
    })
      .format(value)
      .replace("BDT", "৳");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Overview</h1>
          <p className="text-sm text-gray-500">
            Monitor team performance, pipeline health, and recent sales
            activity
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white"
          >
            <Filter className="h-4 w-4" />
            Advanced filters
          </button>
          <button
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white"
          >
            <Download className="h-4 w-4" />
            Export report
          </button>
          <button
            onClick={() => navigate("/sales/new")}
            className="flex items-center gap-2 rounded-lg border border-transparent bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            <PlusCircle className="h-4 w-4" />
            New sale
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          Reporting range
        </div>
        {RANGE_OPTIONS.map((option) => {
          const isActive = option.value === selectedRange;
          return (
            <button
              key={option.value}
              onClick={() => setSelectedRange(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryMetrics.map((metric) => {
          const isPositive = metric.trend === "up";
          const trendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={metric.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {metric.title}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {metric.value}
                  </p>
                </div>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </span>
              </div>
              <div
                className={`mt-4 flex items-center gap-1 text-sm ${
                  isPositive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                <trendIcon className="h-4 w-4" />
                {metric.helperText}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pipeline health</h2>
                <p className="text-sm text-gray-500">
                  {pipelineStages.reduce((sum, stage) => sum + stage.count, 0)}
                  {" "}active deals · {formatCurrency(totalPipelineValue)} open value
                </p>
              </div>
              <button className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
                View full pipeline
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex h-12 overflow-hidden rounded-full bg-gray-100">
                {pipelineStages.map((stage) => {
                  const width = Math.round((stage.value / totalPipelineValue) * 100);
                  return (
                    <div
                      key={stage.id}
                      className={`${stage.color} flex items-center justify-center text-xs font-semibold text-white`}
                      style={{ width: `${width}%` }}
                    >
                      {width > 10 ? `${width}%` : null}
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {pipelineStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stage.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stage.count} deals · {formatCurrency(stage.value)}
                      </p>
                    </div>
                    <span className={`h-10 w-10 rounded-full ${stage.color} bg-opacity-10`}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                View timeline
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-xl border border-transparent p-4 transition hover:border-gray-200 hover:bg-gray-50"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      activity.type === "deal"
                        ? "bg-emerald-50 text-emerald-600"
                        : activity.type === "meeting"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {activity.type === "deal" && <CheckCircle2 className="h-5 w-5" />}
                    {activity.type === "meeting" && <Clock className="h-5 w-5" />}
                    {activity.type === "followup" && <TrendingUp className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        {activity.user}
                      </p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{activity.stage}</p>
                    <p className="text-xs text-gray-500">{activity.amount}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Performance insights
            </h2>
            <p className="text-sm text-gray-500">
              Automated coaching suggestions based on pipeline behavior
            </p>

            <div className="mt-6 space-y-4">
              {performanceInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {insight.label}
                    </p>
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        insight.direction === "up"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {insight.change}
                      {insight.direction === "up" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Next actions</h2>
            <p className="text-sm text-gray-500">
              Reminders generated from your pipeline priorities
            </p>

            <div className="mt-5 space-y-4">
              {[
                {
                  id: "reminder-1",
                  title: "Follow up with Tech Hive",
                  due: "Due today · 4 items pending",
                  accent: "bg-amber-100 text-amber-600",
                },
                {
                  id: "reminder-2",
                  title: "Review demo recordings",
                  due: "Tomorrow · Assigned to Mahira",
                  accent: "bg-blue-100 text-blue-600",
                },
                {
                  id: "reminder-3",
                  title: "Renewal proposals",
                  due: "Friday · 6 contracts expiring",
                  accent: "bg-rose-100 text-rose-600",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <span className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${item.accent}`}>
                    •
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.due}</p>
                  </div>
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                    Mark done
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Leaderboard</h2>
            <p className="text-sm text-gray-500">
              YTD revenue and win rate across the team
            </p>

            <div className="mt-4 space-y-4">
              {[
                {
                  name: "Tanvir Rahman",
                  revenue: "৳ 1.24M",
                  badge: "Top closer",
                  color: "bg-emerald-50 text-emerald-700",
                },
                {
                  name: "Mahira Akter",
                  revenue: "৳ 1.12M",
                  badge: "Highest NPS",
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  name: "Arif Chowdhury",
                  revenue: "৳ 980K",
                  badge: "Fastest cycle",
                  color: "bg-purple-50 text-purple-700",
                },
              ].map((rep) => (
                <div
                  key={rep.name}
                  className="flex items-center justify-between rounded-xl border border-transparent p-3 hover:border-gray-200 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {rep.name}
                    </p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${rep.color}`}
                    >
                      {rep.badge}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {rep.revenue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
