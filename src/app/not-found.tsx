import { RidgeScene } from '@/components/ridge';
import { ButtonLink, Section } from '@/components/ui';

export default function NotFound() {
  return (
    <>
    <Section tone="mist">
      <p className="eyebrow mb-3 text-gold-ink">Page not found</p>
      <h1 className="display-1" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
        This path does not lead to the courtyard
      </h1>
      <p className="lede mt-5">The page you wanted may have moved, or the address may be mistyped.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/register" variant="secondary">
          Join a waitlist
        </ButtonLink>
      </div>
    </Section>
    <div className="bg-mist">
      <RidgeScene mood="mist" className="block w-full" style={{ height: 'clamp(160px, 24vw, 320px)' }} />
    </div>
    </>
  );
}
