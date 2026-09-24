"use client";

import React, { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { DestinationItem } from "@/data/destinationsData";
import { useApp } from "@/context/AppContext";

const inputCls = "w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFA429]/40 bg-white text-slate-800 transition-all";

export default function DestinationsManager() {
  const { destinations, addDestination, updateDestination, deleteDestination } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<DestinationItem | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FFA429]" /> Destination Guides
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage regional landing pages — shown on the homepage grid and each destination's own SEO-optimized page.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-1.5 bg-[#FFA429] hover:bg-[#e08b18] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          No destinations yet.
        </div>
      ) : (
        <div className="space-y-3">
          {destinations.map((d) => (
            <div key={d.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-md hover:border-slate-300 transition-all">
              <div className="flex items-center gap-4 min-w-[280px]">
                {d.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.image} alt={d.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-sm text-slate-900">{d.name} <span className="text-slate-400 font-normal">/{d.slug}</span></div>
                  <div className="text-xs text-slate-600 mt-0.5">{d.tagline}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{d.tourCount} tours · {d.bestTime} · {d.avgBudget}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 ml-1">
                <button
                  onClick={() => { setEditing(d); setShowModal(true); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#FFA429] hover:text-white transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (!confirm(`Delete destination "${d.name}"? This removes its page and homepage card.`)) return;
                    deleteDestination(d.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <DestinationForm
          initial={editing}
          onCancel={() => { setShowModal(false); setEditing(null); }}
          onSave={(d) => {
            if (editing) updateDestination(d);
            else addDestination(d);
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function DestinationForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: DestinationItem | null;
  onCancel: () => void;
  onSave: (d: DestinationItem) => void;
}) {
  const [f, setF] = useState(
    initial
      ? {
          name: initial.name,
          slug: initial.slug,
          tagline: initial.tagline,
          description: initial.description,
          image: initial.image,
          tourCount: initial.tourCount,
          bestTime: initial.bestTime,
          idealDuration: initial.idealDuration,
          avgBudget: initial.avgBudget,
          attractions: initial.attractions.length > 0 ? initial.attractions : [{ name: "", desc: "", icon: "mountain" }],
          seoTitle: initial.seoTitle || "",
          seoDescription: initial.seoDescription || "",
        }
      : {
          name: "",
          slug: "",
          tagline: "",
          description: "",
          image: "",
          tourCount: 0,
          bestTime: "",
          idealDuration: "",
          avgBudget: "",
          attractions: [{ name: "", desc: "", icon: "mountain" }],
          seoTitle: "",
          seoDescription: "",
        }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug =
      f.slug.trim() ||
      f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    onSave({
      id: initial?.id || cleanSlug,
      slug: cleanSlug,
      name: f.name.trim(),
      tagline: f.tagline.trim(),
      description: f.description.trim(),
      image: f.image.trim(),
      tourCount: Number(f.tourCount) || 0,
      bestTime: f.bestTime.trim(),
      idealDuration: f.idealDuration.trim(),
      avgBudget: f.avgBudget.trim(),
      attractions: f.attractions.filter((a) => a.name.trim() && a.desc.trim()),
      seoTitle: f.seoTitle.trim() || undefined,
      seoDescription: f.seoDescription.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70 sticky top-0 z-10">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">{initial ? "Edit Destination" : "Add Destination"}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{initial ? `Updating ${initial.name}` : "Create a new regional landing page"}</p>
          </div>
          <button type="button" onClick={onCancel} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Destination Name *</label>
              <input required placeholder="e.g. Spiti Valley" className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">URL Slug</label>
              <input placeholder="auto-generated if blank" className={inputCls} value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Tagline *</label>
              <input required placeholder="e.g. The Middle Land between India and Tibet" className={inputCls} value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Description *</label>
              <textarea required rows={3} className={inputCls} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Hero Image URL</label>
              <div className="flex items-center gap-3">
                <input placeholder="https://images.unsplash.com/..." className={inputCls} value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} />
                {f.image && <img src={f.image} alt="preview" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Tour Count</label>
              <input type="number" min={0} className={inputCls} value={f.tourCount} onChange={(e) => setF({ ...f, tourCount: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Best Time to Visit</label>
              <input placeholder="e.g. May to October" className={inputCls} value={f.bestTime} onChange={(e) => setF({ ...f, bestTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Ideal Duration</label>
              <input placeholder="e.g. 7 - 10 Days" className={inputCls} value={f.idealDuration} onChange={(e) => setF({ ...f, idealDuration: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Average Budget</label>
              <input placeholder="e.g. ₹18,000 - ₹28,000" className={inputCls} value={f.avgBudget} onChange={(e) => setF({ ...f, avgBudget: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between pt-2">
              <label className="block text-[11px] font-bold text-slate-700">Top Attractions</label>
              <button
                type="button"
                onClick={() => setF({ ...f, attractions: [...f.attractions, { name: "", desc: "", icon: "mountain" }] })}
                className="text-[11px] font-bold text-[#FFA429] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Attraction
              </button>
            </div>
            {f.attractions.map((a, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <input
                  placeholder="Attraction name"
                  value={a.name}
                  onChange={(e) => { const next = [...f.attractions]; next[idx] = { ...next[idx], name: e.target.value }; setF({ ...f, attractions: next }); }}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-[11px] focus:outline-none"
                />
                <input
                  placeholder="Short description"
                  value={a.desc}
                  onChange={(e) => { const next = [...f.attractions]; next[idx] = { ...next[idx], desc: e.target.value }; setF({ ...f, attractions: next }); }}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-[11px] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setF({ ...f, attractions: f.attractions.filter((_, i) => i !== idx) })}
                  className="text-rose-500 hover:text-rose-700 px-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 pt-2">
              <Search className="w-4 h-4 text-[#FFA429]" />
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">SEO & Structured Data</h4>
            </div>
            <p className="text-[11px] text-slate-500">Optional — leave blank to auto-generate from the name/tagline above.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">SEO Title</label>
                <input maxLength={70} placeholder={`${f.name || "Destination"} Travel Guide`} className={inputCls} value={f.seoTitle} onChange={(e) => setF({ ...f, seoTitle: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">SEO Meta Description</label>
                <input maxLength={200} placeholder={f.tagline || "Auto-generated from tagline"} className={inputCls} value={f.seoDescription} onChange={(e) => setF({ ...f, seoDescription: e.target.value })} />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <strong>Live on publish:</strong> TouristDestination schema + BreadcrumbList are automatically emitted on the public destination page.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <button type="button" onClick={onCancel} className="text-xs font-bold text-slate-600 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="bg-[#0A192F] hover:bg-[#152a4a] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">
              {initial ? "Save Changes" : "Create Destination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
