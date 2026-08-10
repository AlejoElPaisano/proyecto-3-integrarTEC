"use client"

import dynamic from "next/dynamic"

const HistoryPanel = dynamic(() => import("./HistoryPanel"), {
  ssr: false,
  loading: () => null,
})

export default function HistoryPanelLazy() {
  return <HistoryPanel />
}
