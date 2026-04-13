import {
  getProducts,
  createProduct,
  updateProduct as updateProductAPI
} from '../api/products';
import {
  getCategories,
  createCategory,
  updateCategoryAPI,
  deleteCategoryAPI
} from '../api/categories';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  Category,
  Product,
  Client,
  Sale,
  CashRegister,
  CashEntry,
  StockMovement,
  Reservation,
  ServiceOrder,
  SilverEvaluation,
} from './types';

interface AppContextType {
  // User
  currentUser: User;
  users: User[];
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Sales
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  
  // Cash Register
  cashRegisters: CashRegister[];
  activeCashRegister: CashRegister | null;
  openCashRegister: (data: Omit<CashRegister, 'id' | 'status'>) => void;
  closeCashRegister: (id: string, data: { finalAmount: number; notes?: string }) => void;
  
  // Cash Entries
  cashEntries: CashEntry[];
  addCashEntry: (entry: Omit<CashEntry, 'id'>) => void;
  
  // Stock Movements
  stockMovements: StockMovement[];
  addStockMovement: (movement: Omit<StockMovement, 'id'>) => void;
  
  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  
  // Service Orders
  serviceOrders: ServiceOrder[];
  addServiceOrder: (order: Omit<ServiceOrder, 'id'>) => void;
  updateServiceOrder: (id: string, order: Partial<ServiceOrder>) => void;
  
  // Silver Evaluations
  silverEvaluations: SilverEvaluation[];
  addSilverEvaluation: (evaluation: Omit<SilverEvaluation, 'id'>) => void;
  updateSilverEvaluation: (id: string, evaluation: Partial<SilverEvaluation>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Mock data inicial
const mockUser: User = {
  id: 'user-1',
  name: 'Admin',
  role: 'admin',
  email: 'admin@joalheria.com',
};

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Anéis', description: 'Anéis de prata' },
  { id: 'cat-2', name: 'Brincos', description: 'Brincos de prata' },
  { id: 'cat-3', name: 'Colares', description: 'Colares de prata' },
  { id: 'cat-4', name: 'Pulseiras', description: 'Pulseiras de prata' },
  { id: 'cat-5', name: 'Pingentes', description: 'Pingentes de prata' },
  { id: 'cat-6', name: 'Conjuntos', description: 'Conjuntos de joias' },
];

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Anel Solitário Prata 925',
    categoryId: 'cat-1',
    sku: 'AN001',
    silverWeight: 3.5,
    silverType: '925',
    salePrice: 150.00,
    costPrice: 80.00,
    description: 'Anel solitário em prata 925 com zircônia',
    stock: 5,
    reservedStock: 0,
  },
  {
    id: 'prod-2',
    name: 'Brinco Argola Média',
    categoryId: 'cat-2',
    sku: 'BR001',
    silverWeight: 2.8,
    silverType: '925',
    salePrice: 120.00,
    costPrice: 60.00,
    description: 'Brinco de argola média em prata 925',
    stock: 8,
    reservedStock: 0,
  },
  {
    id: 'prod-3',
    name: 'Colar Coração',
    categoryId: 'cat-3',
    sku: 'CL001',
    silverWeight: 5.2,
    silverType: '925',
    salePrice: 180.00,
    costPrice: 95.00,
    description: 'Colar com pingente de coração em prata 925',
    stock: 3,
    reservedStock: 1,
  },
  {
    id: 'prod-4',
    name: 'Pulseira Veneziana',
    categoryId: 'cat-4',
    sku: 'PU001',
    silverWeight: 8.0,
    silverType: '925',
    salePrice: 250.00,
    costPrice: 130.00,
    description: 'Pulseira veneziana em prata 925',
    stock: 4,
    reservedStock: 0,
  },
];

const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Maria Silva',
    phone: '(11) 98765-4321',
    email: 'maria@email.com',
  },
  {
    id: 'client-2',
    name: 'João Santos',
    phone: '(11) 91234-5678',
    email: 'joao@email.com',
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {

  const [currentUser] = useState<User>(mockUser);
  const [users] = useState<User[]>([mockUser]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        const formatted = data.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          categoryId: '',
          sku: '',
          silverWeight: 0,
          silverType: '925',
          salePrice: Number(p.price) || 0,
          costPrice: Number(p.price) || 0,
          description: '',
          stock: Number(p.stock) || 0,
          reservedStock: 0,
        }));

        setProducts(formatted);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        const formatted = data.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          description: c.description || '',
        }));

        setCategories(formatted);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
    
    loadCategories();
  }, []);

  const [clients, setClients] = useState<Client[]>(mockClients);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
  const [cashEntries, setCashEntries] = useState<CashEntry[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [silverEvaluations, setSilverEvaluations] = useState<SilverEvaluation[]>([]);

  // Active cash register
  const activeCashRegister = cashRegisters.find((cr) => cr.status === 'aberto') || null;


  // Save to localStorage whenever data changes
  useEffect(() => {
    const data = {
      categories,
      products,
      clients,
      sales,
      cashRegisters,
      cashEntries,
      stockMovements,
      reservations,
      serviceOrders,
      silverEvaluations,
    };

  }, [categories, products, clients, sales, cashRegisters, cashEntries, stockMovements, reservations, serviceOrders, silverEvaluations]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const value: AppContextType = {
    currentUser,
    users,
    
    categories,
    addCategory: async (category) => {
      try {
        const savedCategory = await createCategory(category);

        setCategories((prev) => [
          ...prev,
          {
            ...category,
            id: String(savedCategory.id),
          },
        ]);
      } catch (error) {
        console.error("Erro ao cadastrar categoria:", error);
      }
    },
    updateCategory: (id, updates) => setCategories(categories.map((c) => (c.id === id ? { ...c, ...updates } : c))),
    deleteCategory: (id) => setCategories(categories.filter((c) => c.id !== id)),
    
    products,
    addProduct: async (product) => {
      try {
        const savedProduct = await createProduct(product);
        
        const newProduct = {
          ...product,
          id: String(savedProduct.id),
        };
        
        setProducts((prev) => [...prev, newProduct]);
      } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
      }
    },

    updateProduct: async (id, updates) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      
      const updated = {
        ...product,
        ...updates,
      };
      
      await updateProductAPI(id, updated);
      
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
    );
  },

    deleteProduct: (id) => setProducts(products.filter((p) => p.id !== id)),
    
    clients,
    addClient: (client) => setClients([...clients, { ...client, id: generateId() }]),
    updateClient: (id, updates) => setClients(clients.map((c) => (c.id === id ? { ...c, ...updates } : c))),
    deleteClient: (id) => setClients(clients.filter((c) => c.id !== id)),
    
    sales,
    addSale: (sale) => {
      const newSale = { ...sale, id: generateId() };
      setSales([...sales, newSale]);
      
      // Update product stock
      newSale.items.forEach((item) => {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === item.productId ? { ...p, stock: p.stock - item.quantity } : p
          )
        );
      });
      
      // Add cash entry
      if (activeCashRegister) {
        const cashEntry: Omit<CashEntry, 'id'> = {
          cashRegisterId: activeCashRegister.id,
          date: newSale.date,
          time: newSale.time,
          type: 'entrada',
          category: 'venda',
          amount: newSale.total,
          description: `Venda #${newSale.id} - ${newSale.items.length} item(ns)`,
          userId: currentUser.id,
          userName: currentUser.name,
        };
        setCashEntries((prev) => [...prev, { ...cashEntry, id: generateId() }]);
      }
    },
    
    cashRegisters,
    activeCashRegister,
    openCashRegister: (data) => {
      setCashRegisters([...cashRegisters, { ...data, id: generateId(), status: 'aberto' }]);
    },
    closeCashRegister: (id, { finalAmount, notes }) => {
      setCashRegisters(
        cashRegisters.map((cr) => {
          if (cr.id === id) {
            const entries = cashEntries.filter((e) => e.cashRegisterId === id);
            const totalEntries = entries.filter((e) => e.type === 'entrada').reduce((sum, e) => sum + e.amount, 0);
            const totalExits = entries.filter((e) => e.type === 'saida').reduce((sum, e) => sum + e.amount, 0);
            const expectedAmount = cr.initialAmount + totalEntries - totalExits;
            const difference = finalAmount - expectedAmount;
            
            return {
              ...cr,
              closingTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              finalAmount,
              expectedAmount,
              difference,
              status: 'fechado' as const,
              notes,
            };
          }
          return cr;
        })
      );
    },
    
    cashEntries,
    addCashEntry: (entry) => setCashEntries([...cashEntries, { ...entry, id: generateId() }]),
    
    stockMovements,
    addStockMovement: (movement) => {
      setStockMovements([...stockMovements, { ...movement, id: generateId() }]);
      
      // Update product stock
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === movement.productId) {
            const change = movement.type === 'entrada' ? movement.quantity : -movement.quantity;
            return { ...p, stock: p.stock + change };
          }
          return p;
        })
      );
    },
    
    reservations,
    addReservation: (reservation) => {
      const newReservation = { ...reservation, id: generateId() };
      setReservations([...reservations, newReservation]);
      
      // Update reserved stock
      setProducts((prev) =>
        prev.map((p) =>
          p.id === reservation.productId
            ? { ...p, reservedStock: p.reservedStock + reservation.quantity }
            : p
        )
      );
    },
    updateReservation: (id, updates) => {
      const reservation = reservations.find((r) => r.id === id);
      if (reservation && updates.status === 'cancelada') {
        // Release reserved stock
        setProducts((prev) =>
          prev.map((p) =>
            p.id === reservation.productId
              ? { ...p, reservedStock: p.reservedStock - reservation.quantity }
              : p
          )
        );
      }
      setReservations(reservations.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    },
    
    serviceOrders,
    addServiceOrder: (order) => setServiceOrders([...serviceOrders, { ...order, id: generateId() }]),
    updateServiceOrder: (id, updates) => setServiceOrders(serviceOrders.map((o) => (o.id === id ? { ...o, ...updates } : o))),
    
    silverEvaluations,
    addSilverEvaluation: (evaluation) => setSilverEvaluations([...silverEvaluations, { ...evaluation, id: generateId() }]),
    updateSilverEvaluation: (id, updates) => setSilverEvaluations(silverEvaluations.map((e) => (e.id === id ? { ...e, ...updates } : e))),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}


export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
