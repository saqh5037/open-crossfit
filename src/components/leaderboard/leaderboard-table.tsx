import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"
import type { LeaderboardEntry } from "@/types"

interface WodHeader {
  id: string
  name: string
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  wods: WodHeader[]
}

function MedalBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Badge className="bg-yellow-500 text-white">🥇</Badge>
  if (rank === 2) return <Badge className="bg-gray-400 text-white">🥈</Badge>
  if (rank === 3) return <Badge className="bg-amber-700 text-white">🥉</Badge>
  return <span className="text-gray-400">{rank}</span>
}

export function LeaderboardTable({ entries, wods }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center text-gray-400">
        <Trophy className="h-12 w-12 text-gray-600" />
        <p className="text-lg font-medium">Sin resultados aún</p>
        <p className="text-sm">Los scores aparecerán aquí cuando se capturen.</p>
      </div>
    )
  }

  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-lg sm:border sm:border-gray-800">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow className="border-gray-800 bg-gray-900 hover:bg-gray-900">
            <TableHead className="w-16 text-center text-gray-300">#</TableHead>
            <TableHead className="text-gray-300">Atleta</TableHead>
            {wods.map((wod) => (
              <TableHead key={wod.id} className="text-center text-gray-300">
                {wod.name}
              </TableHead>
            ))}
            <TableHead className="text-center font-bold text-gray-300">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const rank = Number(entry.overall_rank)
            const isTop3 = rank <= 3
            return (
              <TableRow
                key={entry.id}
                className={`border-gray-800 ${isTop3 ? "bg-primary/10" : "hover:bg-gray-900/50"}`}
              >
                <TableCell className="text-center">
                  <MedalBadge rank={rank} />
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/atleta/${entry.id}`}
                    className="text-white hover:text-primary hover:underline transition-colors"
                  >
                    {entry.full_name}
                  </Link>
                </TableCell>
                {wods.map((wod) => {
                  const result = entry.wod_results?.find(
                    (r) => r.wod_id === wod.id
                  )
                  return (
                    <TableCell key={wod.id} className="text-center">
                      {result ? (
                        <div>
                          <span className="text-xs text-gray-400">
                            {result.display_score}
                          </span>
                          <br />
                          <span className="font-bold text-white">{result.placement}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </TableCell>
                  )
                })}
                <TableCell className="text-center">
                  <span className="text-lg font-black text-primary">
                    {Number(entry.total_points) || "—"}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
