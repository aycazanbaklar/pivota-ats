import type { Metadata } from "next";
import { PipelineScreen } from "@/components/internal/pipeline-screen";

export const metadata: Metadata = {
  title: "Pipeline — Pivota İK",
};

export default function PipelinePage() {
  return <PipelineScreen view="board" />;
}
