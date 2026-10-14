import Link from "next/link";
import { Wordmark } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <main id="main" className="on-dark flex min-h-dvh flex-col items-center justify-center bg-ink px-6 text-center text-ivory">
      <Link href="/" aria-label="KNEGRA NYVES — home">
        <Wordmark className="h-7 text-ivory" />
      </Link>
      <p className="eyebrow mt-16 text-camel">Not in the register</p>
      <h1 className="mt-5 font-display text-[clamp(44px,6vw,88px)] font-light italic leading-none">This page was never written.</h1>
      <p className="mt-6 max-w-md text-[15px] text-ivory/75">The piece or page you were looking for doesn’t exist — or hasn’t been entered in the register yet.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-ivory">
          Return home
        </Link>
        <Link href="/shop" className="btn btn-outline-light">
          All pieces
        </Link>
      </div>
    </main>
  );
}
