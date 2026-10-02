"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Recycle } from "lucide-react";

// Dynamically import Lottie to prevent SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Import animation data
let mascotAnimation: object | null = null;
try {
  mascotAnimation = require("../../public/mascot.json");
} catch {
  mascotAnimation = null;
}

interface MascotProps {
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export function Mascot({
  className = "w-48 h-48",
  autoplay = true,
  loop = true,
}: MascotProps) {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={className} />;

  // Fallback icon if animation fails or data is missing
  if (hasError || !mascotAnimation) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <Recycle className="w-2/3 h-2/3 text-emerald-400 animate-spin" style={{ animationDuration: "3s" }} />
      </div>
    );
  }

  return (
    <div className={className}>
      <ErrorBoundaryWrapper onError={() => setHasError(true)}>
        <Lottie
          animationData={mascotAnimation}
          loop={loop}
          autoplay={autoplay}
          style={{ width: "100%", height: "100%" }}
        />
      </ErrorBoundaryWrapper>
    </div>
  );
}

// Simple error boundary wrapper
class ErrorBoundaryWrapper extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
