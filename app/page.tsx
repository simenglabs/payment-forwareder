import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">Saweria Payment</p>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">API Reference</h1>
          <p className="text-sm text-zinc-500 mt-1">Base URL: <span className="font-mono text-zinc-700 dark:text-zinc-300">https://your-domain.com</span></p>
        </div>

        {/* Endpoints */}
        <div className="space-y-3 mb-12">
          {/* POST /api/donate */}
          <details className="group border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-zinc-50 dark:hover:bg-zinc-900 transition list-none">
              <span className="text-xs font-bold font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded">POST</span>
              <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">/api/donate</span>
              <span className="ml-auto text-xs text-zinc-400">Buat donasi QRIS</span>
            </summary>
            <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Request Body</p>
                <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs rounded-md p-4 overflow-x-auto">{`{
  "nominal": 1000,       // required — jumlah donasi (IDR)
  "platform": "huastream", // required
  "name": "Nasri",       // required
  "email": "..."         // optional, default: menglabsofficial@gmail.com
}`}</pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Response <span className="text-emerald-500">201</span></p>
                <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs rounded-md p-4 overflow-x-auto">{`{
  "qr_string": "00020101..."
}`}</pre>
              </div>
            </div>
          </details>

          {/* POST /api/webhook/saweria */}
          <details className="group border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-zinc-50 dark:hover:bg-zinc-900 transition list-none">
              <span className="text-xs font-bold font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded">POST</span>
              <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">/api/webhook/saweria</span>
              <span className="ml-auto text-xs text-zinc-400">Saweria webhook receiver</span>
            </summary>
            <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-4 space-y-4">
              <p className="text-xs text-zinc-500">Daftarkan URL ini ke Saweria. Webhook akan diforward ke target berdasarkan platform yang diparsing dari <span className="font-mono">donator_name</span> (format: <span className="font-mono text-zinc-700 dark:text-zinc-300">platform-name</span>).</p>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Saweria Webhook Body</p>
                <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs rounded-md p-4 overflow-x-auto">{`{
  "version": "2022.01",
  "created_at": "2026-06-07T21:36:01.013665+07:00",
  "id": "a4092755-...",
  "type": "donation",
  "amount_raw": 1008,
  "cut": -58,
  "donator_name": "huastream-Nasri",  // platform = "huastream"
  "donator_email": "...",
  "donator_is_user": false,
  "message": "test message",
  "etc": {
    "qr_string": "...",
    "amount_to_display": 1000,
    "transaction_fee_policy": "TIPPER"
  }
}`}</pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Response <span className="text-emerald-500">200</span></p>
                <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs rounded-md p-4 overflow-x-auto">{`{
  "received": true,
  "platform": "huastream",
  "forwarded_to": "https://..."
}`}</pre>
              </div>
            </div>
          </details>

          {/* GET /api/webhook-targets */}
          <details className="group border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-zinc-50 dark:hover:bg-zinc-900 transition list-none">
              <span className="text-xs font-bold font-mono bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-0.5 rounded">GET</span>
              <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">/api/webhook-targets</span>
              <span className="ml-auto text-xs text-zinc-400">List semua targets</span>
            </summary>
            <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-4">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Response <span className="text-emerald-500">200</span></p>
              <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs rounded-md p-4 overflow-x-auto">{`{
  "data": [
    {
      "id": "uuid",
      "platform": "huastream",
      "webhook_url": "https://...",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}`}</pre>
            </div>
          </details>

          {/* POST /api/webhook-targets */}
          <details className="group border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-zinc-50 dark:hover:bg-zinc-900 transition list-none">
              <span className="text-xs font-bold font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded">POST</span>
              <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">/api/webhook-targets</span>
              <span className="ml-auto text-xs text-zinc-400">Tambah / update target</span>
            </summary>
            <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Request Body</p>
                <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs rounded-md p-4 overflow-x-auto">{`{
  "platform": "huastream",
  "webhook_url": "https://example.com/webhook"
}`}</pre>
              </div>
            </div>
          </details>

          {/* DELETE /api/webhook-targets/:id */}
          <details className="group border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-zinc-50 dark:hover:bg-zinc-900 transition list-none">
              <span className="text-xs font-bold font-mono bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-2 py-0.5 rounded">DEL</span>
              <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">/api/webhook-targets/:id</span>
              <span className="ml-auto text-xs text-zinc-400">Hapus target</span>
            </summary>
            <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-4">
              <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs rounded-md p-4 overflow-x-auto">{`{ "success": true }`}</pre>
            </div>
          </details>
        </div>

        {/* Link to management */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-8">
          <Link
            href="/webhook-targets"
            className="inline-flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            Kelola Webhook Targets →
          </Link>
        </div>
      </div>
    </div>
  );
}

