import { useState } from 'react';
import { useApp } from '../context';
import { toast } from 'sonner';
import { Plus, Minus, ShoppingCart, Search, X, Trash2, User } from 'lucide-react';
import type { SaleItem } from '../types';

export function PDV() {
  const { products, clients, addSale, currentUser, activeCashRegister, categories } = useApp();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'pix' | 'cartao_debito' | 'cartao_credito' | 'parcelado'>('dinheiro');
  const [installments, setInstallments] = useState(1);
  const [discount, setDiscount] = useState(0);

  if (!activeCashRegister) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Caixa Fechado</h3>
        <p className="text-gray-600">É necessário abrir o caixa para realizar vendas.</p>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const availableStock = product.stock - product.reservedStock;
    const currentQty = cart.find((item) => item.productId === productId)?.quantity || 0;

    if (currentQty >= availableStock) {
      toast.error('Estoque insuficiente');
      return;
    }

    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: Math.random().toString(36).substr(2, 9),
          productId,
          productName: product.name,
          quantity: 1,
          unitPrice: product.salePrice,
          totalPrice: product.salePrice,
        },
      ]);
    }
    toast.success('Produto adicionado');
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;

    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    const newQty = item.quantity + delta;
    const availableStock = product.stock - product.reservedStock;

    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (newQty > availableStock) {
      toast.error('Estoque insuficiente');
      return;
    }

    setCart(
      cart.map((i) =>
        i.id === itemId
          ? { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice }
          : i
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
    toast.info('Produto removido');
  };

  const clearCart = () => {
    setCart([]);
    setSelectedClientId('');
    setDiscount(0);
    setPaymentMethod('dinheiro');
    setInstallments(1);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal - discount;

  const completeSale = () => {
    if (cart.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    if (total <= 0) {
      toast.error('Total inválido');
      return;
    }

    const now = new Date();
    const selectedClient = clients.find((c) => c.id === selectedClientId);

    addSale({
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      items: cart,
      subtotal,
      discount,
      total,
      paymentMethod,
      clientId: selectedClientId || undefined,
      clientName: selectedClient?.name || undefined,
      userId: currentUser.id,
      userName: currentUser.name,
      cashRegisterId: activeCashRegister.id,
      installments: paymentMethod === 'parcelado' ? installments : undefined,
    });

    toast.success('Venda finalizada com sucesso!');
    clearCart();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">PDV - Ponto de Venda</h2>
        <p className="text-gray-600 mt-1">Realize vendas de joias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produto por nome ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-3">Produtos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {filteredProducts.map((product) => {
                const availableStock = product.stock - product.reservedStock;
                const category = categories.find((c) => c.id === product.categoryId);
                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product.id)}
                    disabled={availableStock === 0}
                    className={`text-left p-4 border-2 rounded-lg transition-all ${
                      availableStock === 0
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{category?.name}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">{product.sku}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-blue-600">
                        R$ {product.salePrice.toFixed(2)}
                      </p>
                      <p className={`text-xs font-medium ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {availableStock > 0 ? `${availableStock} disponível` : 'Esgotado'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {product.silverWeight}g • Prata {product.silverType}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Carrinho</h3>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Carrinho vazio</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 flex-1">{item.productName}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-blue-600">
                        R$ {item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Client */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Cliente (opcional)
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="parcelado">Parcelado</option>
              </select>
            </div>

            {/* Installments */}
            {paymentMethod === 'parcelado' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Parcelas
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n}x de R$ {(total / n).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Discount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desconto (R$)
              </label>
              <input
                type="number"
                min="0"
                max={subtotal}
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Math.min(subtotal, Number(e.target.value))))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Totals */}
            <div className="space-y-2 py-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desconto:</span>
                  <span className="font-medium text-red-600">- R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg pt-2 border-t">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-blue-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Complete Sale Button */}
            <button
              onClick={completeSale}
              disabled={cart.length === 0}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Finalizar Venda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
