import HeroEmpresa from "@/components/HeroEmpresa";
import PlazaSection from "@/components/PlazaSection";
import { getPlazasActivas } from "@/lib/get-plazas";

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ busqueda?: string }>;
};

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const busqueda = searchParams?.busqueda || "";
  const plazas = await getPlazasActivas();

  return (
    <div className="flex flex-col">
      <HeroEmpresa plazas={plazas} />
      <PlazaSection plazas={plazas} busquedaInicial={busqueda} />
      
    </div>
  );
}
