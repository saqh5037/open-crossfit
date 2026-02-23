import { JudgePanel } from "@/components/scores/judge-panel"

export default function JudgePage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-1 text-2xl font-bold">Capturar Score</h1>
      <p className="mb-6 text-sm text-gray-400">
        Selecciona el WOD activo y busca al atleta para registrar su score.
      </p>
      <JudgePanel />
    </div>
  )
}
