// Mulberry32 — fast, deterministic seeded PRNG
// Same seed → same sequence every time → same DemoWorld every demo run

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = (Math.imul(31, hash) + s.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export class SeededRandom {
  private rand: () => number

  constructor(seed: string) {
    this.rand = mulberry32(hashString(seed))
  }

  next(): number {
    return this.rand()
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }

  shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  bool(probability = 0.5): boolean {
    return this.next() < probability
  }

  ulid(): string {
    const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
    let result = '01'
    for (let i = 0; i < 24; i++) {
      result += chars[this.int(0, chars.length - 1)]
    }
    return result.toLowerCase()
  }

  reqId(): string {
    return `REQ-${String(this.int(100000, 999999))}`
  }

  delReqId(): string {
    return `DEL-REQ-${String(this.int(1000, 9999))}`
  }

  futureDate(minDays: number, maxDays: number): { iso: string; display: string; daysRemaining: number } {
    const days = this.int(minDays, maxDays)
    const d = new Date()
    d.setDate(d.getDate() + days)
    return {
      iso: d.toISOString().split('T')[0],
      display: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      daysRemaining: days,
    }
  }

  pastDate(minDaysAgo: number, maxDaysAgo: number): string {
    const days = this.int(minDaysAgo, maxDaysAgo)
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }
}
