import Link from "next/link";
import { asset } from "@/lib/paths";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

type Tile =
  | { type: "image"; title: string; href: string; image: string; span: readonly [number, number] }
  | { type: "text"; text: string; span: readonly [number, number] };

const colSpan: Record<number, string> = { 1: "md:col-span-1", 2: "md:col-span-2" };
const rowSpan: Record<number, string> = { 1: "md:row-span-1", 2: "md:row-span-2" };

/**
 * Mosaico de categorías de la home: rejilla de 4 columnas con celdas cuadradas
 * de 325 px (en 1300 px) y tarjetas de texto sobre la textura menta.
 */
export function CategoryMosaic({ tiles }: { tiles: readonly Tile[] }) {
  return (
    <section className="pt-[57px] pb-[75px]">
      <Container>
        <ul className="grid grid-cols-1 md:auto-rows-[calc((min(100vw-40px,1300px))/4)] md:grid-cols-4">
          {tiles.map((tile, i) => (
            <li key={i} className={`relative ${colSpan[tile.span[0]]} ${rowSpan[tile.span[1]]}`}>
              {tile.type === "image" ? (
                <Link
                  href={tile.href}
                  className="group relative block aspect-square h-full overflow-hidden md:aspect-auto"
                >
                  <img
                    src={asset(tile.image)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.82] transition duration-500 group-hover:scale-105 group-hover:brightness-75"
                  />
                  <span className="font-display-regular absolute inset-0 flex items-center justify-center px-4 text-center text-h4 text-accent">
                    {tile.title}
                  </span>
                  <Icon
                    name="plus"
                    strokeWidth={1.5}
                    className="absolute right-[25px] bottom-[25px] h-[30px] w-[30px] text-accent transition-transform duration-300 group-hover:rotate-90"
                  />
                </Link>
              ) : (
                <div
                  className="flex aspect-square h-full items-center p-[35px] md:aspect-auto"
                  style={{ backgroundImage: `url(${asset("/images/home/textura-menta.webp")})` }}
                >
                  <p className="font-display-regular text-h4 leading-[1.5] text-navy">{tile.text}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
