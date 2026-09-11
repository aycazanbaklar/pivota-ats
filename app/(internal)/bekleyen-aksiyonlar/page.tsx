import type { Metadata } from "next";
import { PipelineScreen } from "@/components/internal/pipeline-screen";

export const metadata: Metadata = {
  title: "Bekleyen Aksiyonlarınız — Pivota İK",
};

export default function PendingActionsPage() {
  return <PipelineScreen view="pending" />;
}
