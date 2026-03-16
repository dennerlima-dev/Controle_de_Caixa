// Tipos do sistema de caixa da joalheria

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'vendedor' | 'caixa';
  email: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  sku: string;
  silverWeight: number; // em gramas
  silverType: string; // ex: 925, 950
  salePrice: number;
  costPrice: number;
  description: string;
  photo?: string;
  stock: number;
  reservedStock: number;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  cpf?: string;
  address?: string;
  notes?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  date: string;
  time: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'dinheiro' | 'pix' | 'cartao_debito' | 'cartao_credito' | 'parcelado';
  clientId?: string;
  clientName?: string;
  userId: string;
  userName: string;
  cashRegisterId: string;
  installments?: number;
  notes?: string;
}

export interface CashRegister {
  id: string;
  date: string;
  openingTime: string;
  closingTime?: string;
  operatorId: string;
  operatorName: string;
  initialAmount: number;
  finalAmount?: number;
  expectedAmount?: number;
  difference?: number;
  status: 'aberto' | 'fechado';
  notes?: string;
}

export interface CashEntry {
  id: string;
  cashRegisterId: string;
  date: string;
  time: string;
  type: 'entrada' | 'saida';
  category: 'venda' | 'pagamento_cliente' | 'ajuste' | 'deposito' | 'sangria' | 'despesa' | 'outro';
  amount: number;
  description: string;
  userId: string;
  userName: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  date: string;
  time: string;
  type: 'entrada' | 'saida' | 'ajuste';
  quantity: number;
  reason: string;
  userId: string;
  userName: string;
}

export interface Reservation {
  id: string;
  productId: string;
  productName: string;
  clientId: string;
  clientName: string;
  quantity: number;
  date: string;
  expiryDate: string;
  status: 'ativa' | 'concluida' | 'cancelada';
  notes?: string;
}

export interface ServiceOrder {
  id: string;
  clientId: string;
  clientName: string;
  type: 'conserto' | 'ajuste' | 'limpeza' | 'avaliacao';
  description: string;
  estimatedValue?: number;
  finalValue?: number;
  date: string;
  expectedDelivery?: string;
  deliveryDate?: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'entregue';
  notes?: string;
}

export interface SilverEvaluation {
  id: string;
  clientId?: string;
  clientName?: string;
  date: string;
  silverType: string;
  weight: number; // em gramas
  pricePerGram: number;
  totalValue: number;
  description: string;
  status: 'avaliado' | 'comprado' | 'recusado';
}
