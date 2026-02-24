import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Event Config
  const config = await prisma.eventConfig.upsert({
    where: { id: "default-event" },
    update: {},
    create: {
      id: "default-event",
      name: "CrossFit Open 2026",
      description: "Competencia interna de CrossFit Open. 3 días, 3 WODs, un solo campeón.",
      start_date: new Date("2026-02-26"),
      end_date: new Date("2026-03-12"),
      primary_color: "#DC2626",
      secondary_color: "#1F2937",
      registration_open: true,
      divisions: [
        "rx_male", "rx_female",
        "scaled_male", "scaled_female",
      ],
    },
  })
  console.log(`✅ Event: ${config.name}`)

  // WODs
  const wods = await Promise.all([
    prisma.wod.upsert({
      where: { day_number: 1 },
      update: {},
      create: {
        name: "Open 26.1",
        day_number: 1,
        description: "For Time:\n3 Rounds of:\n10 Thrusters (95/65 lb)\n15 Bar-Facing Burpees\n20 Double-Unders\nTime Cap: 12 minutes",
        score_type: "time",
        time_cap_seconds: 720,
        sort_order: "asc",
      },
    }),
    prisma.wod.upsert({
      where: { day_number: 2 },
      update: {},
      create: {
        name: "Open 26.2",
        day_number: 2,
        description: "AMRAP in 15 minutes:\n5 Deadlifts (225/155 lb)\n10 Toes-to-Bar\n15 Wall Balls (20/14 lb)",
        score_type: "reps",
        time_cap_seconds: 900,
        sort_order: "desc",
      },
    }),
    prisma.wod.upsert({
      where: { day_number: 3 },
      update: {},
      create: {
        name: "Open 26.3",
        day_number: 3,
        description: "Clean & Jerk Complex:\n1 Squat Clean + 1 Hang Clean + 1 Split Jerk\nFind your 1RM in 12 minutes",
        score_type: "weight",
        time_cap_seconds: 720,
        sort_order: "desc",
      },
    }),
  ])
  console.log(`✅ WODs: ${wods.map((w) => w.name).join(", ")}`)

  // Athletes
  const athleteData = [
    { full_name: "Carlos Mendoza", email: "carlos@test.com", phone: "9991001001", gender: "M" as const, division: "rx_male" },
    { full_name: "Diego Ramírez", email: "diego@test.com", phone: "9991001002", gender: "M" as const, division: "rx_male" },
    { full_name: "Miguel Torres", email: "miguel@test.com", phone: "9991001003", gender: "M" as const, division: "rx_male" },
    { full_name: "Andrés López", email: "andres@test.com", phone: "9991001004", gender: "M" as const, division: "scaled_male" },
    { full_name: "Roberto García", email: "roberto@test.com", phone: "9991001005", gender: "M" as const, division: "scaled_male" },
    { full_name: "Ana Martínez", email: "ana@test.com", phone: "9991001006", gender: "F" as const, division: "rx_female" },
    { full_name: "María Hernández", email: "maria@test.com", phone: "9991001007", gender: "F" as const, division: "rx_female" },
    { full_name: "Sofía Flores", email: "sofia@test.com", phone: "9991001008", gender: "F" as const, division: "rx_female" },
    { full_name: "Laura Sánchez", email: "laura@test.com", phone: "9991001009", gender: "F" as const, division: "scaled_female" },
    { full_name: "Patricia Díaz", email: "patricia@test.com", phone: "9991001010", gender: "F" as const, division: "scaled_female" },
  ]

  const athletes = await Promise.all(
    athleteData.map((a) =>
      prisma.athlete.upsert({
        where: { email: a.email },
        update: {},
        create: a,
      })
    )
  )
  console.log(`✅ Athletes: ${athletes.length} created`)

  // Scores (sample for WOD 26.1 and 26.2)
  const rxMaleAthletes = athletes.filter((a) => a.division === "rx_male")
  const rxFemaleAthletes = athletes.filter((a) => a.division === "rx_female")

  const scoreData = [
    { athlete_id: rxMaleAthletes[0]?.id, wod_id: wods[0].id, raw_score: 540, display_score: "9:00" },
    { athlete_id: rxMaleAthletes[1]?.id, wod_id: wods[0].id, raw_score: 612, display_score: "10:12" },
    { athlete_id: rxMaleAthletes[2]?.id, wod_id: wods[0].id, raw_score: 480, display_score: "8:00" },
    { athlete_id: rxFemaleAthletes[0]?.id, wod_id: wods[0].id, raw_score: 600, display_score: "10:00" },
    { athlete_id: rxFemaleAthletes[1]?.id, wod_id: wods[0].id, raw_score: 558, display_score: "9:18" },
    { athlete_id: rxFemaleAthletes[2]?.id, wod_id: wods[0].id, raw_score: 510, display_score: "8:30" },
    { athlete_id: rxMaleAthletes[0]?.id, wod_id: wods[1].id, raw_score: 180, display_score: "180 reps" },
    { athlete_id: rxMaleAthletes[1]?.id, wod_id: wods[1].id, raw_score: 155, display_score: "155 reps" },
    { athlete_id: rxMaleAthletes[2]?.id, wod_id: wods[1].id, raw_score: 200, display_score: "200 reps" },
    { athlete_id: rxFemaleAthletes[0]?.id, wod_id: wods[1].id, raw_score: 165, display_score: "165 reps" },
    { athlete_id: rxFemaleAthletes[1]?.id, wod_id: wods[1].id, raw_score: 190, display_score: "190 reps" },
    { athlete_id: rxFemaleAthletes[2]?.id, wod_id: wods[1].id, raw_score: 145, display_score: "145 reps" },
  ]

  for (const score of scoreData) {
    if (!score.athlete_id) continue
    await prisma.score.upsert({
      where: {
        athlete_id_wod_id: {
          athlete_id: score.athlete_id,
          wod_id: score.wod_id,
        },
      },
      update: { raw_score: score.raw_score, display_score: score.display_score },
      create: { ...score, is_rx: true },
    })
  }
  console.log(`✅ Scores: ${scoreData.length} created`)

  // Admin User (password: admin123)
  const passwordHash = await hash("admin123", 10)
  await prisma.adminUser.upsert({
    where: { email: "admin@opencrossfit.com" },
    update: {},
    create: {
      email: "admin@opencrossfit.com",
      password_hash: passwordHash,
      role: "owner",
    },
  })
  console.log("✅ Admin: admin@opencrossfit.com / admin123 (owner)")

  console.log("\n🎉 Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
