"use client";

import dynamic from "next/dynamic";

const DesignLab = dynamic(() => import("./DesignLab").then((m) => m.DesignLab), {
  ssr: false,
});

export function LabLoader() {
  return <DesignLab />;
}
