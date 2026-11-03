import Image from 'next/image';

/**
 * Sai Legacy Holdings logo, used exactly as supplied (1000 x 307 px). Never recolour, crop or
 * reproportion it. The supplied file has an opaque white background, so it always sits on white.
 */
export function SaiLogo({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div className={`rounded-[2px] border border-pale bg-white p-6 sm:p-10 ${className}`}>
      <Image
        src="/brand/sai-legacy-holdings-logo.png"
        alt="Sai Legacy Holdings: Rooted in Africa. Building for Generations."
        width={1000}
        height={307}
        priority={priority}
        sizes="(min-width: 1024px) 480px, 90vw"
        className="mx-auto h-auto w-full max-w-[520px]"
      />
    </div>
  );
}
