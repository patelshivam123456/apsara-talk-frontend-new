"use client";
import PageLayout from "@/components/PageLayout";

const activities = [
  { icon: "💬", title: "Chat with Dr. Aryan Sharma",  desc: "Vedic Astrology · 30 min session",  time: "Today, 4:00 PM",    type: "session" },
  { icon: "⭐", title: "Viewed Daily Horoscope",       desc: "Aries — Love & Career",             time: "Today, 10:15 AM",   type: "view" },
  { icon: "📜", title: "Kundli Generated",             desc: "Birth chart saved to your profile", time: "Yesterday, 7:30 PM",type: "report" },
  { icon: "❤️", title: "Compatibility Check",          desc: "Aries × Libra — 87% match",        time: "May 11, 3:00 PM",   type: "tool" },
  { icon: "🤖", title: "Asked the Universe",           desc: '"Will I find love this year?"',     time: "May 10, 9:00 AM",   type: "ai" },
  { icon: "💰", title: "Wallet Recharged",             desc: "Added ₹200 to wallet",              time: "May 9, 6:45 PM",    type: "wallet" },
];

const typeColor = { session: "text-purple-400", view: "text-yellow-400", report: "text-blue-400", tool: "text-pink-400", ai: "text-green-400", wallet: "text-emerald-400" };

export default function ActivityPage() {
  return (
    <PageLayout title="My Activity" icon="📊">
      <div className="max-w-2xl mx-auto space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{a.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{a.desc}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-[10px] font-medium capitalize ${typeColor[a.type]}`}>{a.type}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
