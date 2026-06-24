'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PaymentCard, PaymentHistoryRecord } from '@/types';
import { Plus, CreditCard, Loader2 } from 'lucide-react';
import AddPaymentMethodModal from './AddPaymentMethodModal';
import PaymentDetailModal from './PaymentDetailModal';

// Initial payment cards matching Figma layout
const INITIAL_CARDS: PaymentCard[] = [
  {
    id: 'card-1',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/26',
    isDefault: true
  },
  {
    id: 'card-2',
    brand: 'Mastercard',
    last4: '5555',
    expiry: '08/25',
    isDefault: false
  }
];

// Initial history matching Figma layout
const INITIAL_HISTORY: PaymentHistoryRecord[] = [
  {
    id: 'PAY-001',
    description: 'Platform subscription & fees',
    method: 'Visa •••• 4242',
    amount: 24580,
    date: 'Dec 15',
    status: 'Completed'
  },
  {
    id: 'PAY-002',
    description: 'Inventory top-up',
    method: 'Mastercard •••• 5555',
    amount: 8400,
    date: 'Dec 10',
    status: 'Completed'
  },
  {
    id: 'PAY-003',
    description: 'Commission payout',
    method: 'Visa •••• 4242',
    amount: 3200,
    date: 'Dec 8',
    status: 'Pending'
  },
  {
    id: 'PAY-004',
    description: 'Merchant settlement',
    method: 'Bank Transfer',
    amount: 45000,
    date: 'Dec 1',
    status: 'Completed'
  }
];

export default function PaymentsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<PaymentCard[]>(INITIAL_CARDS);
  const [history] = useState<PaymentHistoryRecord[]>(INITIAL_HISTORY);
  
  // Modal visibility states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState<PaymentHistoryRecord | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSetDefault = (cardId: string) => {
    setCards(
      cards.map((c) => ({
        ...c,
        isDefault: c.id === cardId
      }))
    );
  };

  const handleRemoveCard = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
  };

  const handleAddCard = (newCardData: { brand: 'Visa' | 'Mastercard'; last4: string; expiry: string; isDefault: boolean }) => {
    const newCard: PaymentCard = {
      id: `card-${Date.now()}`,
      brand: newCardData.brand,
      last4: newCardData.last4,
      expiry: newCardData.expiry,
      isDefault: newCardData.isDefault
    };

    if (newCardData.isDefault) {
      setCards(
        cards.map((c) => ({ ...c, isDefault: false })).concat(newCard)
      );
    } else {
      setCards([...cards, newCard]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading payment methods...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Payments</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage payment methods and view payment history.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.id} className="relative">
            <Card
              className={`h-full border transition-all duration-300 ${
                card.isDefault
                  ? 'border-blue-600 shadow-md ring-4 ring-blue-50/50 dark:border-blue-500 dark:ring-blue-950/20'
                  : 'border-slate-200/80 bg-white hover:border-slate-350 dark:border-slate-800'
              }`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-44">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                      <CreditCard className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-850 dark:text-white block">
                        {card.brand}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                        Expires {card.expiry}
                      </span>
                    </div>
                  </div>

                  {card.isDefault && (
                    <Badge variant="info" className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
                      Default
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="font-mono text-sm tracking-widest text-slate-700 dark:text-slate-300">
                    •••• •••• •••• {card.last4}
                  </div>

                  {/* Actions links row */}
                  <div className="flex items-center gap-4 text-[10px] font-bold">
                    {!card.isDefault && (
                      <button
                        onClick={() => handleSetDefault(card.id)}
                        className="text-slate-650 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveCard(card.id)}
                      className="text-red-500 hover:text-red-750 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Empty dotted card slot */}
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-2xl border-2 border-dashed border-slate-200/80 bg-white hover:border-blue-500 hover:bg-slate-50/50 cursor-pointer flex flex-col items-center justify-center h-44 text-slate-400 hover:text-blue-500 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/30"
        >
          <Plus className="h-7 w-7 mb-2" />
          <span className="text-xs font-bold tracking-tight">Add new payment method</span>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="space-y-3.5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white pl-1">Payment History</h3>
        
        <Card className="border-slate-100 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Payment ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  {/* Clickable blue link */}
                  <TableCell className="pl-6 font-bold text-xs">
                    <button
                      onClick={() => setViewingPayment(record)}
                      className="text-blue-650 hover:underline dark:text-blue-450 outline-none text-left"
                    >
                      {record.id}
                    </button>
                  </TableCell>

                  <TableCell className="font-semibold text-slate-700 dark:text-slate-350">
                    {record.description}
                  </TableCell>

                  <TableCell className="font-semibold text-slate-555">
                    {record.method}
                  </TableCell>

                  <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                    ${record.amount.toLocaleString()}
                  </TableCell>

                  <TableCell className="font-semibold text-slate-500">
                    {record.date}
                  </TableCell>

                  <TableCell className="pr-6">
                    <Badge variant={getStatusVariant(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Modal Overlays */}
      <AddPaymentMethodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCard}
      />

      <PaymentDetailModal
        isOpen={!!viewingPayment}
        payment={viewingPayment}
        onClose={() => setViewingPayment(null)}
      />
    </div>
  );
}
