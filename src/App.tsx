import React, { useState, useMemo } from 'react';
import { 
  Satellite, 
  Smartphone, 
  Wifi, 
  MessageSquare, 
  Plane, 
  CheckCircle2,
  Info,
  Minus,
  Plus,
  ShoppingCart,
  Calculator,
  List
} from 'lucide-react';

// --- DATA ---
const PLANES = [
  {
    id: 'plan150',
    name: '150 gigas',
    description: 'Plan Móvil 5G con Cobertura Satelital',
    features: [
      { text: '200 SMS satelital Starlink', icon: <Satellite className="w-5 h-5 text-blue-600" /> },
      { text: '150 gigas para navegar', icon: <Wifi className="w-5 h-5 text-blue-600" /> },
      { text: '1.000 minutos todo destino', icon: <Smartphone className="w-5 h-5 text-blue-600" /> },
      { text: 'Whatsapp y correo libre', icon: <CheckCircle2 className="w-5 h-5 text-blue-600" /> },
      { text: 'Envía hasta 700 SMS', icon: <MessageSquare className="w-5 h-5 text-blue-600" /> }
    ],
    pricesNet: { '1': 8187, '2-3': 8187, '4-10': 8187, '11+': 8187 }
  },
  {
    id: 'plan400',
    name: '400 gigas',
    description: 'Plan Móvil 5G con Cobertura Satelital',
    features: [
      { text: '200 SMS satelital Starlink', icon: <Satellite className="w-5 h-5 text-blue-600" /> },
      { text: '400 gigas para navegar', icon: <Wifi className="w-5 h-5 text-blue-600" /> },
      { text: 'Minutos libres todo destino', icon: <Smartphone className="w-5 h-5 text-blue-600" /> },
      { text: 'Whatsapp y correo libre', icon: <CheckCircle2 className="w-5 h-5 text-blue-600" /> },
      { text: 'Envía hasta 1000 SMS', icon: <MessageSquare className="w-5 h-5 text-blue-600" /> }
    ],
    pricesNet: { '1': 8566, '2-3': 7810, '4-10': 7810, '11+': 7306 }
  },
  {
    id: 'planLibre',
    name: 'Libre',
    description: 'Plan Móvil 5G con Cobertura Satelital',
    features: [
      { 
        text: 'Cobertura satelital', 
        sub: 'Mantente conectado incluso en zonas donde no hay cobertura de la red móvil terrestre.*',
        icon: <Satellite className="w-5 h-5 text-blue-600" /> 
      },
      { text: 'WhatsApp libre satelital', icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
      { text: '200 SMS satelitales', icon: <MessageSquare className="w-5 h-5 text-blue-600" /> },
      { text: 'Gigas libres de navegación', icon: <Wifi className="w-5 h-5 text-blue-600" /> },
      { text: 'Minutos libres todo destino', icon: <Smartphone className="w-5 h-5 text-blue-600" /> },
      { text: 'Envía hasta 1500 SMS', icon: <MessageSquare className="w-5 h-5 text-blue-600" /> }
    ],
    pricesNet: { '1': 11087, '2-3': 9323, '4-10': 8818, '11+': 8314 }
  },
  {
    id: 'planLibreRoaming',
    name: 'Libre + 1 GB / Diario Roaming',
    description: 'Plan Móvil 5G con Cobertura Satelital',
    features: [
      { 
        text: 'Cobertura satelital', 
        sub: 'Mantente conectado incluso en zonas donde no hay cobertura de la red móvil terrestre.*',
        icon: <Satellite className="w-5 h-5 text-blue-600" /> 
      },
      { 
        text: '1 GB en Apps satelitales', 
        sub: 'compatibles Apple Maps, Google Maps, Accuweather, X',
        icon: <CheckCircle2 className="w-5 h-5 text-blue-600" /> 
      },
      { text: 'WhatsApp libre satelital', icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
      { text: '200 SMS satelitales', icon: <MessageSquare className="w-5 h-5 text-blue-600" /> },
      { text: 'Gigas libres de navegación', icon: <Wifi className="w-5 h-5 text-blue-600" /> },
      { text: 'Minutos libres todo destino', icon: <Smartphone className="w-5 h-5 text-blue-600" /> },
      { text: 'Envía hasta 1500 SMS', icon: <MessageSquare className="w-5 h-5 text-blue-600" /> },
      { 
        text: 'Roaming: 1 GB diario', 
        sub: 'No se corta, solo baja velocidad. RRSS ilimitadas.',
        icon: <Plane className="w-5 h-5 text-blue-600" /> 
      },
      { 
        text: '70 min y 70 SMS mensual Roaming', 
        icon: <Smartphone className="w-5 h-5 text-blue-600" /> 
      }
    ],
    pricesNet: { '1': 12012, '2-3': 10395, '4-10': 9932, '11+': 9470 }
  }
];

const IVA_RATE = 0.19;

// --- UTILS ---
const formatCLP = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
};

const getTramo = (totalLines: number) => {
  if (totalLines <= 1) return '1';
  if (totalLines >= 2 && totalLines <= 3) return '2-3';
  if (totalLines >= 4 && totalLines <= 10) return '4-10';
  return '11+';
};

const getTramoLabel = (tramoId: string) => {
  switch(tramoId) {
    case '1': return '1 Línea';
    case '2-3': return '2 a 3 Líneas';
    case '4-10': return '4 a 10 Líneas';
    case '11+': return '11 o más Líneas';
    default: return '';
  }
}

// --- COMPONENTS ---
export default function App() {
  const [activeTab, setActiveTab] = useState('planes'); // 'planes' | 'cotizador'
  const [lines, setLines] = useState<Record<string, number>>({
    plan150: 0,
    plan400: 0,
    planLibre: 0,
    planLibreRoaming: 0
  });

  const updateLine = (planId: string, amount: number) => {
    setLines(prev => ({
      ...prev,
      [planId]: Math.max(0, prev[planId] + amount)
    }));
  };

  // Cálculos reactivos
  const { totalLines, currentTramo, subtotalNeto, iva, totalBruto, cartItems } = useMemo(() => {
    const totalLinesCalc = Object.values(lines).reduce((a, b) => a + b, 0);
    const tramoCalc = getTramo(totalLinesCalc);
    
    let netoCalc = 0;
    const items: Array<{
      plan: typeof PLANES[0];
      cant: number;
      unitPriceNet: number;
      lineTotalNet: number;
    }> = [];

    PLANES.forEach(plan => {
      const cant = lines[plan.id];
      if (cant > 0) {
        const unitPriceNet = plan.pricesNet[tramoCalc as keyof typeof plan.pricesNet];
        const lineTotalNet = cant * unitPriceNet;
        netoCalc += lineTotalNet;
        items.push({
          plan,
          cant,
          unitPriceNet,
          lineTotalNet
        });
      }
    });

    const ivaCalc = Math.round(netoCalc * IVA_RATE);
    const brutoCalc = netoCalc + ivaCalc;

    return {
      totalLines: totalLinesCalc,
      currentTramo: tramoCalc,
      subtotalNeto: netoCalc,
      iva: ivaCalc,
      totalBruto: brutoCalc,
      cartItems: items
    };
  }, [lines]);


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* Header */}
      <header className="bg-blue-600 text-white h-[90px] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Satellite className="w-[24px] h-[24px]" />
            <h1 className="text-[20px] font-bold tracking-tight">Conectividad 5G Satelital</h1>
          </div>
          <div className="text-[13px] opacity-80 font-medium hidden sm:block">Ventas Corporativas & Retail</div>
        </div>
      </header>

      {/* Navegación (Tabs) */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 mt-6">
        <div className="flex gap-[2px] bg-slate-100 p-1 rounded-lg w-fit">
          <button 
            onClick={() => setActiveTab('planes')}
            className={`px-5 py-2 text-[14px] font-semibold rounded-md transition-all ${activeTab === 'planes' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-blue-600' : 'bg-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Catálogo de Planes
          </button>
          <button 
            onClick={() => setActiveTab('cotizador')}
            className={`px-5 py-2 text-[14px] font-semibold rounded-md transition-all ${activeTab === 'cotizador' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-blue-600' : 'bg-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Cotizador Avanzado
          </button>
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto w-full px-6 lg:px-10 py-6 pb-10 flex-1">
        
        {/* PESTAÑA: PLANES */}
        {activeTab === 'planes' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 p-3 px-4 rounded-[10px] text-[13px] text-amber-800 mb-6">
              <Info className="w-[18px] h-[18px] flex-shrink-0" />
              <p>Conoce las características de nuestros planes. <strong>Los precios mostrados son referenciales para 1 línea (Neto).</strong> Si necesitas más líneas, revisa nuestro <button onClick={() => setActiveTab('cotizador')} className="underline font-bold">Cotizador</button> para aprovechar descuentos por volumen.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PLANES.map(plan => (
                <div key={plan.id} className="bg-white border border-slate-200 rounded-xl flex flex-col transition-colors hover:border-blue-600 overflow-hidden shadow-sm">
                  {/* Card Header */}
                  <div className="p-4 px-5 border-b border-slate-100">
                    <p className="text-[13px] text-slate-600 mb-1">{plan.description}</p>
                    <h3 className="text-[16px] font-bold text-slate-900 mb-3">{plan.name}</h3>
                    
                    <div className="bg-slate-50 -mx-5 px-5 py-3 border-y border-slate-100 flex flex-col justify-center">
                      <div className="flex items-baseline gap-1 text-blue-600 font-bold">
                        <span className="text-2xl">{formatCLP(plan.pricesNet['1'])}</span>
                        <span className="text-[11px] opacity-80">NETO/mes</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Precio referencial 1 línea.</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 px-5 flex-1 bg-white">
                    <ul className="space-y-3">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start">
                          <div className="mt-0.5 w-[18px] h-[18px] flex-shrink-0 text-blue-600 *:[width:100%] *:[height:100%]">{feat.icon}</div>
                          <div>
                            <span className="text-slate-700 text-[13px] font-medium leading-tight">{feat.text}</span>
                            {feat.sub && <p className="text-[12px] text-slate-500 mt-0.5 leading-tight">{feat.sub}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 px-5 bg-slate-50 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        updateLine(plan.id, 1);
                        setActiveTab('cotizador');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] py-2.5 rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Cotizar Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Detalle Roaming Adicional */}
            <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-5 items-start">
              <div className="bg-slate-100 p-3 rounded-xl text-slate-500 flex-shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-1">Detalle de Condiciones: Roaming Internacional</h3>
                <p className="text-[13px] text-slate-600 mb-4">Válido para el <strong>Plan Libre + 1 GB / Diario Roaming</strong>.</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-[13px] text-slate-700">
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 flex-shrink-0"/> 
                    <span className="leading-tight"><strong>Navegación Continua:</strong> Tienes 1GB diario. Al completar la cuota, el servicio <strong>no se corta</strong>, únicamente baja la velocidad de navegación.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 flex-shrink-0"/> 
                    <span className="leading-tight"><strong>Renovación de Cuota:</strong> El Giga diario se vuelve a cargar automáticamente al pasar exactamente 24 horas desde el momento de su activación.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 flex-shrink-0"/> 
                    <span className="leading-tight"><strong>Redes Sociales:</strong> Incluye acceso a RRSS ilimitadas mientras utilices el servicio de Roaming.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 flex-shrink-0"/> 
                    <span className="leading-tight"><strong>Voz y SMS:</strong> Incluye una bolsa mensual de 70 minutos y 70 SMS exclusivos para usar estando en Roaming.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* PESTAÑA: COTIZADOR */}
        {activeTab === 'cotizador' && (
          <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            
            {/* Left Col: Plan Selectors */}
            <div className="flex flex-col gap-4">
              
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 p-3 px-4 rounded-[10px] text-[13px] text-amber-800 mb-2">
                <Info className="w-[18px] h-[18px] flex-shrink-0" />
                <p>El descuento por volumen se aplica automáticamente según el total de líneas seleccionadas.</p>
              </div>

              {PLANES.map(plan => (
                <div key={plan.id} className="bg-white border border-slate-200 rounded-xl p-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between transition-colors hover:border-blue-600 gap-4">
                  <div className="flex-1 text-left">
                    <h3 className="text-[16px] font-bold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-[13px] text-slate-600">{plan.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <button 
                        onClick={() => updateLine(plan.id, -1)}
                        disabled={lines[plan.id] === 0}
                        className="w-9 h-9 flex items-center justify-center text-[18px] font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-200 transition-colors"
                      >
                        -
                      </button>
                      <div className="w-11 text-center font-bold text-[15px] text-slate-900">
                        {lines[plan.id]}
                      </div>
                      <button 
                        onClick={() => updateLine(plan.id, 1)}
                        className="w-9 h-9 flex items-center justify-center text-[18px] font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    {lines[plan.id] > 0 ? (
                      <div className="font-bold text-blue-600 text-right min-w-[80px]">
                        {formatCLP(plan.pricesNet[getTramo(totalLines) as keyof typeof plan.pricesNet] * lines[plan.id])}
                        <div className="text-[10px] opacity-60">NETO</div>
                      </div>
                    ) : (
                      <div className="font-bold text-slate-400 text-right min-w-[80px]">
                        {formatCLP(plan.pricesNet['1'])}
                        <div className="text-[10px] opacity-60">DESDE</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Col: Summary */}
            <aside>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col sticky top-6">
                <div className="text-[18px] font-bold mb-5 flex items-center gap-2.5 text-slate-900">
                  <ShoppingCart className="w-5 h-5 text-slate-900" />
                  Resumen de Pedido
                </div>

                {totalLines === 0 ? (
                  <div className="text-center py-8 text-slate-400 flex flex-col items-center">
                    <Calculator className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-[13px]">Agrega líneas para ver tu cotización.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-5">
                      <span className="bg-blue-600 text-white text-[11px] px-2 py-1 rounded tracking-wide uppercase font-bold">
                        {getTramoLabel(currentTramo)}
                      </span>
                      <div className="text-[12px] text-slate-600 mt-1.5">
                        Total de líneas activas: <strong>{totalLines}</strong>
                      </div>
                    </div>

                    <ul className="flex-1 list-none mb-6 border-b border-slate-200">
                      {cartItems.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-[13px] mb-3">
                          <span className="text-slate-600">{item.cant}x Plan {item.plan.name}</span>
                          <span className="font-semibold text-slate-900">{formatCLP(item.lineTotalNet)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-[14px] text-slate-600">
                        <span>Subtotal Neto</span>
                        <span>{formatCLP(subtotalNeto)}</span>
                      </div>
                      <div className="flex justify-between text-[14px] text-slate-600">
                        <span>IVA (19%)</span>
                        <span>{formatCLP(iva)}</span>
                      </div>
                      <div className="flex justify-between text-[24px] font-[800] text-blue-600 mt-3 pt-3 border-t border-slate-200">
                        <span>TOTAL</span>
                        <span>{formatCLP(totalBruto)}</span>
                      </div>
                    </div>

                    <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] w-full py-[14px] font-bold text-[15px] transition-colors border-none cursor-pointer">
                      Generar Cotización PDF
                    </button>
                    <p className="text-center text-[11px] text-slate-500 mt-3">Valor mensual estimado. Sujeto a factibilidad técnica.</p>
                  </>
                )}
              </div>
            </aside>

          </div>
        )}
      </main>
    </div>
  );
}

