import type {
  BattleFighter,
  BattleResult,
  BattleTurn,
  SimulateBattleOptions,
} from '@/features/battle/types/battle.types'
import { calculateTcgDamage } from '@/features/battle/utils/tcgDamage'

interface FighterState {
  fighter: BattleFighter
  currentHp: number
}

function resolveTurn(
  turn: number,
  attackerState: FighterState,
  defenderState: FighterState,
): BattleTurn {
  const { fighter: attacker } = attackerState
  const { fighter: defender } = defenderState
  const damageResult = calculateTcgDamage(
    attacker.attackDamage,
    attacker.attackType,
    defender.weakness,
    defender.resistance,
  )

  const attackerHpBefore = attackerState.currentHp
  const defenderHpBefore = defenderState.currentHp

  defenderState.currentHp = Math.max(0, defenderState.currentHp - damageResult.finalDamage)

  return {
    turn,
    attackerId: attacker.id,
    defenderId: defender.id,
    attackName: attacker.attackName,
    baseDamage: damageResult.baseDamage,
    afterWeakness: damageResult.afterWeakness,
    finalDamage: damageResult.finalDamage,
    weaknessApplied: damageResult.weaknessApplied,
    resistanceApplied: damageResult.resistanceApplied,
    damageCounters: damageResult.damageCounters,
    knockedOut: defenderState.currentHp <= 0,
    attackerHpBefore,
    attackerHpAfter: attackerState.currentHp,
    defenderHpBefore,
    defenderHpAfter: defenderState.currentHp,
  }
}

export function simulateBattle(
  fighter1: BattleFighter,
  fighter2: BattleFighter,
  options: SimulateBattleOptions = {},
): BattleResult {
  const maxTurns = options.maxTurns ?? 50
  const state1: FighterState = { fighter: fighter1, currentHp: fighter1.maxHp }
  const state2: FighterState = { fighter: fighter2, currentHp: fighter2.maxHp }
  const turns: BattleTurn[] = []

  const coinFlipWinnerId =
    options.firstPlayerId ??
    (Math.random() < 0.5 ? fighter1.id : fighter2.id)
  const firstPlayerId = coinFlipWinnerId

  function getAttackerState(turnNumber: number): [FighterState, FighterState] {
    const fighter1Attacks =
      firstPlayerId === fighter1.id ? turnNumber % 2 === 1 : turnNumber % 2 === 0

    return fighter1Attacks ? [state1, state2] : [state2, state1]
  }

  let turn = 1

  while (state1.currentHp > 0 && state2.currentHp > 0 && turn <= maxTurns) {
    const [attackerState, defenderState] = getAttackerState(turn)
    turns.push(resolveTurn(turn, attackerState, defenderState))
    turn += 1
  }

  let winnerId: number | null = null
  if (state1.currentHp > 0 && state2.currentHp <= 0) winnerId = fighter1.id
  else if (state2.currentHp > 0 && state1.currentHp <= 0) winnerId = fighter2.id

  return {
    fighter1,
    fighter2,
    coinFlipWinnerId,
    firstPlayerId,
    turns,
    winnerId,
    totalTurns: turns.length,
  }
}
