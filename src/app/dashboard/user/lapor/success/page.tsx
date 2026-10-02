import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LaporanSuccessPage() {
  return (
    <div className="max-w-md mx-auto mt-12 animate-in fade-in zoom-in duration-500">
      <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10 glow-emerald relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />

        <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full flex items-center justify-center mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">Laporan Berhasil!</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Terima kasih telah berkontribusi menjaga kebersihan lingkungan. Laporan Anda telah tersimpan ke dalam sistem.
            </p>
          </div>

          <div className="w-full pt-4">
            <Link href="/dashboard/user" className="w-full block">
              <Button className="w-full shadow-emerald-500/25" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
