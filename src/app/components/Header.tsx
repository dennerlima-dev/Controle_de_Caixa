import { useApp } from "../context";

export function Header({ showUser = true }: { showUser?: boolean }) {
  const { currentUser, activeCashRegister } = useApp();

  return (
    <header className="bg-[#1E3A5F] shadow-sm border-b sticky top-0 z-40">
      <div className="px-4 py-3 flex items-center justify-between">
        
        {/* ESQUERDA */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.webp"
            alt="Logo"
            className="w-8 h-8 rounded-full object-cover"
          />

          <h1 className="text-xl font-semibold flex items-center">
            <span className="text-white">
              ÁGUA E SAL |
            </span>

            <span
              className="ml-2"
              style={{ color: "lab(86.15% -4.04379 -21.0797)" }}
            >
              Controle de Caixa
            </span>
          </h1>
        </div>

        {/* DIREITA (OPCIONAL) */}
        {showUser && (
          <div className="flex items-center gap-4">
            
            {activeCashRegister ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Caixa Aberto
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Caixa Fechado
              </div>
            )}

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 px-2 py-1">
                {currentUser.name}
              </p>

              <button
                onClick={() => {
                  localStorage.removeItem("auth");
                  window.location.href = "/login";
                }}
                className="text-xs text-red-500"
              >
                Sair
              </button>

              <p className="text-base text-gray-500 capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}