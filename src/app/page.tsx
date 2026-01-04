"use client";

import { useState } from "react";
import { useSchedule } from "@/hooks/useSchedule";
import { PixelCard, PixelButton, PixelTextarea, ScheduleItemCard, PixelBackground, ThemeSwitcher } from "@/components";
import { ScheduleItem } from "@/types";
import { Sparkles, Trash2, Plus, Loader2, Terminal, Cloud } from "lucide-react";
import { EditModal } from "./EditModal";
import { AddManualModal } from "./AddManualModal";

export default function Home() {
  const { schedule, isHydrated, addItem, addItems, updateItem, deleteItem, toggleStatus, clearSchedule } =
    useSchedule();

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate schedule");
      }

      addItems(data.schedule);
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditSave = (updated: ScheduleItem) => {
    updateItem(updated.id, updated);
    setEditingItem(null);
  };

  const handleAddManual = (item: Omit<ScheduleItem, "id" | "status">) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      status: "pending",
    };
    addItem(newItem);
    setIsAddModalOpen(false);
  };

  const pendingCount = schedule.filter((i) => i.status === "pending").length;
  const doneCount = schedule.filter((i) => i.status === "done").length;

  return (
    <>
      <PixelBackground />
      <main className="min-h-screen p-4 md:p-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Cloud size={40} className="text-cloud-white" strokeWidth={2.5} />
              <h1 className="font-pixel text-xl md:text-4xl text-cloud-white tracking-wider drop-shadow-[2px_2px_0px_#230006]">
                {"SYNTHFOCUS".split("").map((char, i) => (
                  <span key={i} className="animate-pixel-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                    {char}
                  </span>
                ))}
              </h1>
              <Cloud size={40} className="text-cloud-white transform scale-x-[-1]" strokeWidth={2.5} />
            </div>
            <p className="font-terminal text-xl text-ink">[ AI-POWERED DAILY SCHEDULER ]</p>
          </header>

          {/* AI Command Center */}
          <PixelCard className="mb-8 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal size={20} className="text-pop-pink" strokeWidth={3} />
              <h2 className="font-pixel text-xs text-pop-pink uppercase tracking-wider animate-retro-typing">
                Command Center
              </h2>
            </div>

            <PixelTextarea
              placeholder="Type your plan here... (e.g., 'morning class at 8, dicoding after lunch, work meeting at 3pm')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={4}
            />

            {error && (
              <div className="mt-4 p-3 border-4 border-pop-danger bg-pop-danger/20 text-pop-danger font-terminal text-lg">
                ⚠ {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              <PixelButton variant="primary" onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" strokeWidth={3} />
                    GENERATE SCHEDULE
                  </>
                )}
              </PixelButton>

              <PixelButton variant="secondary" onClick={() => setIsAddModalOpen(true)}>
                <Plus size={18} className="mr-2" strokeWidth={3} />
                ADD MANUAL
              </PixelButton>
            </div>
          </PixelCard>

          {/* Schedule List Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h2 className="font-pixel text-sm md:text-md text-cloud-white uppercase tracking-wider drop-shadow-[2px_2px_0px_#230006]">
                {["Quest", "Log!"].map((word, i) => (
                  <span key={i} className="animate-word-bounce mr-2" style={{ animationDelay: `${i * 0.1}s` }}>
                    {word}
                  </span>
                ))}
              </h2>
              {schedule.length > 0 && (
                <div className="flex gap-3 font-terminal text-xl">
                  <span className="text-cloud-cream drop-shadow-[1px_1px_0px_#230006]">{pendingCount} pending</span>
                  <span className="text-cloud-white drop-shadow-[1px_1px_0px_#230006]">{doneCount} done</span>
                </div>
              )}
            </div>
            {schedule.length > 0 && (
              <PixelButton variant="danger" size="sm" onClick={clearSchedule}>
                <Trash2 size={14} className="mr-2" strokeWidth={3} />
                CLEAR ALL
              </PixelButton>
            )}
          </div>

          {/* Schedule List */}
          {!isHydrated ? (
            <PixelCard className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 text-ink-dim">
                <Loader2 size={24} className="animate-spin" />
                <span className="font-terminal text-xl">Loading...</span>
              </div>
            </PixelCard>
          ) : schedule.length === 0 ? (
            <PixelCard className="p-8 text-center">
              <div className="text-6xl mb-4">☁️</div>
              <p className="font-pixel text-xs text-ink-dim mb-2">NO QUESTS YET</p>
              <p className="font-terminal text-xl text-ink-dim">
                Type your daily plan above and let AI organize it for you!
              </p>
            </PixelCard>
          ) : (
            <div className="space-y-4">
              {schedule.map((item) => (
                <ScheduleItemCard
                  key={item.id}
                  item={item}
                  onToggleStatus={toggleStatus}
                  onEdit={setEditingItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="font-terminal text-lg text-ink-dim">SYNTHFOCUS v1.0 • Built with ☁️ and Pixels</p>
          </footer>
        </div>

        {/* Edit Modal */}
        {editingItem && <EditModal item={editingItem} onSave={handleEditSave} onClose={() => setEditingItem(null)} />}

        {/* Add Manual Modal */}
        {isAddModalOpen && <AddManualModal onSave={handleAddManual} onClose={() => setIsAddModalOpen(false)} />}
      </main>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </>
  );
}
