"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface WebhookTarget {
  id: string;
  platform: string;
  webhook_url: string;
  created_at: string;
  updated_at: string;
}

export default function WebhookTargetsPage() {
  const [targets, setTargets] = useState<WebhookTarget[]>([]);
  const [platform, setPlatform] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  async function fetchTargets() {
    const res = await fetch("/api/webhook-targets");
    const json = await res.json();
    setTargets(json.data ?? []);
  }

  useEffect(() => {
    fetchTargets();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/webhook-targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, webhook_url: webhookUrl }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error ?? "Gagal menyimpan");
      } else {
        setPlatform("");
        setWebhookUrl("");
        await fetchTargets();
      }
    } finally {
      setLoading(false);
    }
  }

  function startEdit(t: WebhookTarget) {
    setEditingId(t.id);
    setEditUrl(t.webhook_url);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditUrl("");
  }

  async function handleEdit(currentPlatform: string) {
    setEditLoading(true);
    try {
      await fetch("/api/webhook-targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: currentPlatform, webhook_url: editUrl }),
      });
      setEditingId(null);
      await fetchTargets();
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus webhook target ini?")) return;
    await fetch(`/api/webhook-targets/${id}`, { method: "DELETE" });
    await fetchTargets();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition mb-6 inline-block">
            ← API Reference
          </Link>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Webhook Targets</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Platform diparsing dari <span className="font-mono text-zinc-700 dark:text-zinc-300">donator_name</span>{" "}
            (format: <span className="font-mono">platform-name</span>)
          </p>
        </div>

        {/* Add form */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
              className="w-32 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500"
            />
            <input
              type="url"
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              required
              className="flex-1 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-80 disabled:opacity-40 transition"
            >
              {loading ? "..." : "Tambah"}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </form>

        {/* Table */}
        {targets.length === 0 ? (
          <p className="text-sm text-zinc-400 py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            Belum ada target.
          </p>
        ) : (
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-zinc-500 uppercase tracking-wider w-28">Platform</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Webhook URL</th>
                  <th className="px-4 py-2.5 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {targets.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 align-middle">
                      {t.platform}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      {editingId === t.id ? (
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            autoFocus
                            className="flex-1 border border-zinc-300 dark:border-zinc-600 rounded-md px-2 py-1 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                          />
                          <button
                            onClick={() => handleEdit(t.platform)}
                            disabled={editLoading}
                            className="text-xs px-2 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-80 disabled:opacity-40 transition"
                          >
                            {editLoading ? "..." : "Simpan"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs px-2 py-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono truncate block max-w-xs">
                          {t.webhook_url}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right align-middle">
                      {editingId !== t.id && (
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => startEdit(t)}
                            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-xs text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
