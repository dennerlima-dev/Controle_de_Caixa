import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PDV } from './pages/PDV';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Clients } from './pages/Clients';
import { CashRegister } from './pages/CashRegister';
import { CashHistory } from './pages/CashHistory';
import { Sales } from './pages/Sales';
import { Reports } from './pages/Reports';
import { Reservations } from './pages/Reservations';
import { ServiceOrders } from './pages/ServiceOrders';
import { SilverEvaluation } from './pages/SilverEvaluation';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login'
import { ProtectedRoute } from './components/ProtectedRoute'

export const router = createBrowserRouter([

  // ROTA PÚBLICA (LOGIN)
  { 
    path: 'login',
    Component: Login
  },

  // ROTAS PROTEGIDAS
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: 'pdv', Component: PDV },
      { path: 'produtos', Component: Products },
      { path: 'categorias', Component: Categories },
      { path: 'clientes', Component: Clients },
      { path: 'caixa', Component: CashRegister },
      { path: 'caixa/historico', Component: CashHistory },
      { path: 'vendas', Component: Sales },
      { path: 'relatorios', Component: Reports },
      { path: 'reservas', Component: Reservations },
      { path: 'ordens-servico', Component: ServiceOrders },
      { path: 'avaliacao-prata', Component: SilverEvaluation },
      { path: '*', Component: NotFound },
    ],
  },
]);
