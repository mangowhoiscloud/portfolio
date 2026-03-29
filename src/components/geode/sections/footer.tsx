import Image from "next/image";
import Link from "next/link";

export function GeodeFooter() {
  return (
    <footer className="relative py-16 px-4 sm:px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/portfolio/images/geode-idle.png" alt="Geodi" width={32} height={32} className="opacity-40" />
          <div>
            <div className="text-sm font-semibold text-white/50">GEODE v0.32</div>
            <div className="text-xs text-[#7A8CA8]">Long-running Autonomous Execution Harness</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/mangowhoiscloud/geode"
            target="_blank"
            className="text-xs font-mono text-[#7A8CA8] hover:text-[#8B9CC0] transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="https://rooftopsnow.tistory.com/category/Harness"
            target="_blank"
            className="text-xs font-mono text-[#7A8CA8] hover:text-[#8B9CC0] transition-colors"
          >
            Dev Blog
          </Link>
          <Link
            href="/"
            className="text-xs font-mono text-[#7A8CA8] hover:text-[#8B9CC0] transition-colors"
          >
            Portfolio
          </Link>
        </div>

        <div className="text-[10px] text-[#7A8CA8]/50 font-mono">
          © 2025-2026 Jihwan Ryu
        </div>
      </div>
    </footer>
  );
}
