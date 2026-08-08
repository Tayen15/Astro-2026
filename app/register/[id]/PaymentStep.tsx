'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Building2,
  Receipt,
  Clock,
  Smartphone,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { Competition } from '@/types/astro';

interface Props {
  competition: Competition;
  formData: {
    fullName: string;
    teamName: string;
    institution: string;
    identityNumber: string;
    leaderName: string;
    leaderIdentity: string;
    email: string;
    whatsapp: string;
    members: string;
  };
  isTeam: boolean;
  registrationId: string;
  paymentReference: string;
  onBack: () => void;
}

const bankInfo = {
  bankName: 'Bank Central Asia (BCA)',
  accountNumber: '1234567890',
  accountHolder: 'Panitia ASTRO 2026',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

// QRIS payload format (EMVCo standard) — static QRIS for simulation
function generateQrisPayload(reference: string, amount: number) {
  const merchantPan = '9360021188000002'; // mock merchant ID
  const merchantName = 'PANITIA ASTRO 2026';
  const city = 'BANDUNG';
  const postal = '40100';

  const payload = [
    '000201',                          // Payload Format Indicator
    '010211',                          // Point of Initiation Method: Static
    `2620${String(merchantPan.length).padStart(2, '0')}${merchantPan}`, // Merchant Account Info
    `52040000`,                        // Merchant Category Code
    `5303360`,                         // Transaction Currency (IDR)
    `54${String(String(amount).length).padStart(2, '0')}${amount}`, // Transaction Amount
    `5802ID`,                          // Country Code
    `59${String(merchantName.length).padStart(2, '0')}${merchantName}`, // Merchant Name
    `60${String(city.length).padStart(2, '0')}${city}`, // Merchant City
    `61${String(postal.length).padStart(2, '0')}${postal}`, // Postal Code
    `6304`,                            // CRC (placeholder)
  ].join('');

  return `${reference}|${payload}`;
}

const SIMULATION_DURATION = 18; // seconds before auto-detect paid

export default function PaymentStep({ competition, paymentReference, onBack }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'detecting' | 'paid'>('pending');
  const [elapsed, setElapsed] = useState(0);
  const reference = paymentReference;

  // ─── Simulation: timer → detecting → paid ───
  useEffect(() => {
    if (paymentStatus === 'paid') return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= 3 && paymentStatus === 'pending') {
          setPaymentStatus('detecting');
        }
        if (next >= SIMULATION_DURATION) {
          setPaymentStatus('paid');
          clearInterval(interval);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentStatus]);

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrisValue = generateQrisPayload(reference, competition.fee);
  const progress = Math.min((elapsed / SIMULATION_DURATION) * 100, 100);

  const remaining = Math.max(SIMULATION_DURATION - elapsed, 0);

  return (
    <div className="space-y-8">
      {/* ─── PAID STATE ─── */}
      <AnimatePresence mode="wait">
        {paymentStatus === 'paid' ? (
          <motion.div
            key="paid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Success header */}
            <div className="text-center space-y-3">
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.15 }}
              >
                <div className="p-4 bg-emerald-50 border border-emerald-200"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
              </motion.div>
              <motion.h2
                className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                Pembayaran Berhasil!
              </motion.h2>
              <motion.p
                className="text-sm text-slate-600 max-w-md mx-auto font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                Pendaftaran dan pembayaran kamu telah diterima.
              </motion.p>
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <div className="accent-line" />
              </motion.div>
            </div>

            {/* Go to status page */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => router.push('/check-registration')}
                className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-astro-cyan hover:bg-cyan-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-95 cursor-pointer"
                style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Lihat Status Pendaftaran
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* ─── QRIS + BANK TRANSFER STATE (pending / detecting) ─── */
          <motion.div
            key="payment-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white border border-slate-200"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  <Receipt className="w-12 h-12 text-astro-cyan" />
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Selesaikan Pembayaran
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto font-light">
                Lakukan pembayaran sebesar{' '}
                <strong className="text-slate-900">{formatCurrency(competition.fee)}</strong>{' '}
                melalui QRIS atau transfer bank untuk mengamankan slot di{' '}
                <strong>{competition.title}</strong>.
              </p>
              <div className="flex justify-center">
                <div className="accent-line" />
              </div>
            </div>

            {/* ─── TWO-COLUMN: QRIS + BANK TRANSFER ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

              {/* ─── QRIS ─── */}
              <div
                className="bg-white border border-slate-200 relative"
                style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
              >
                <div
                  className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                />

                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-astro-cyan" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.15em]">
                      Pembayaran QRIS
                    </h3>
                  </div>

                  <div className="flex flex-col items-center gap-5">
                    {/* QR Code */}
                    <div className="bg-white p-3 border-2 border-slate-200"
                      style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
                    >
                      <QRCodeSVG
                        value={qrisValue}
                        size={220}
                        bgColor="#ffffff"
                        fgColor="#0f172a"
                        level="M"
                        includeMargin={false}
                      />
                    </div>

                    {/* Amount */}
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Total Pembayaran
                      </span>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        {formatCurrency(competition.fee)}
                      </p>
                    </div>

                    {/* Reference */}
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Referensi
                      </span>
                      <p className="text-xs font-mono font-bold text-slate-700 mt-0.5 tracking-wide">
                        {reference}
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="text-center">
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Scan QRIS di samping menggunakan aplikasi{' '}
                        <strong>GoPay, OVO, DANA, ShopeePay,</strong> atau{' '}
                        <strong>Mobile Banking</strong> yang mendukung QRIS.
                      </p>
                    </div>

                    {/* Payment status timer */}
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span className={
                          paymentStatus === 'detecting' ? 'text-amber-600' : 'text-slate-400'
                        }>
                          {paymentStatus === 'detecting' ? (
                            <span className="flex items-center gap-1.5">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Mendeteksi Pembayaran...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              Menunggu Pembayaran
                            </span>
                          )}
                        </span>
                        <span className="text-slate-400">
                          {remaining > 0 ? `${remaining}s` : '—'}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
                        <motion.div
                          className={`h-full transition-colors duration-500 ${
                            paymentStatus === 'detecting' ? 'bg-amber-400' : 'bg-astro-cyan'
                          }`}
                          layout
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {paymentStatus === 'detecting' && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 text-center"
                          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                        >
                          <AlertCircle className="w-3 h-3 inline mr-1 -mt-0.5" />
                          Pembayaran terdeteksi, menunggu konfirmasi...
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── BANK TRANSFER ─── */}
              <div
                className="bg-white border border-slate-200 relative"
                style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
              >
                <div
                  className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                />

                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-astro-cyan" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.15em]">
                      Transfer Bank Manual
                    </h3>
                  </div>

                  <div className="space-y-5 text-sm">
                    {/* Bank */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bank Penerima</span>
                      <p className="text-slate-900 font-bold mt-1">{bankInfo.bankName}</p>
                    </div>

                    {/* Atas Nama */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Atas Nama</span>
                      <p className="text-slate-900 font-bold mt-1">{bankInfo.accountHolder}</p>
                    </div>

                    {/* Nomor Rekening */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nomor Rekening</span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xl text-slate-900 font-mono font-black tracking-[0.1em]">
                          {bankInfo.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="p-2 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 transition-all duration-200 cursor-pointer bg-white"
                          style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                          aria-label="Salin nomor rekening"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        {copied && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5"
                            style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                          >
                            Tersalin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Jumlah */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jumlah Transfer</span>
                      <p className="text-xl text-astro-cyan font-black mt-1">
                        {formatCurrency(competition.fee)}
                      </p>
                    </div>
                  </div>

                  {/* Important note */}
                  <div className="border border-amber-200 bg-amber-50/40 p-4"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <span className="font-black uppercase tracking-wider">Penting:</span>{' '}
                      Simpan bukti transfer dan konfirmasi ke CP melalui WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 w-full px-8 py-3.5 border border-slate-300 hover:border-astro-cyan text-slate-700 hover:text-astro-cyan font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer bg-white"
              style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Form Pendaftaran
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
