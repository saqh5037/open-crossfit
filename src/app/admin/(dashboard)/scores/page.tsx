import { JudgePanel } from "@/components/scores/judge-panel"

export default function ScoresPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Capturar Scores</h1>
      <JudgePanel />
    </div>
  )
}
