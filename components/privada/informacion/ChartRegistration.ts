/**
 * ChartRegistration - Registra todos los componentes y controladores necesarios
 * de Chart.js para que funcionen los gráficos en la aplicación. Debe importarse
 * al menos una vez en la aplicación para que Chart.js registre sus elementos.
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export { ChartJS };
