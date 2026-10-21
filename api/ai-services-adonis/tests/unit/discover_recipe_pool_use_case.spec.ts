import { test } from '@japa/runner'
import { buildDiscoveryCandidates } from '../../app/features/recipes/use_cases/discover_recipe_pool_use_case.ts'

const mealTimes = [
  { id: 1, slug: 'breakfast' },
  { id: 2, slug: 'lunch' },
  { id: 3, slug: 'diner' },
  { id: 4, slug: 'snack' },
]

test.group('DiscoverRecipePoolUseCase', () => {
  test('assigns one random meal time to every candidate when none is selected', ({ assert }) => {
    const randomValues = [0, 0.25, 0.5, 0.75]
    let randomCall = 0
    const candidates = buildDiscoveryCandidates(
      'Un plat facile',
      [],
      mealTimes,
      () => randomValues[randomCall++ % randomValues.length]!
    )

    assert.lengthOf(candidates, 10)
    assert.deepEqual(
      candidates.map((candidate) => candidate.requiredMealTimeSlug),
      [
        'breakfast',
        'lunch',
        'diner',
        'snack',
        'breakfast',
        'lunch',
        'diner',
        'snack',
        'breakfast',
        'lunch',
      ]
    )
    assert.isTrue(
      candidates.every(
        (candidate) =>
          candidate.requiredMealTimeSlug !== null &&
          candidate.prompt.includes('Contrainte obligatoire — moment de repas')
      )
    )
  })

  test('keeps explicitly selected meal times unconstrained per candidate', ({ assert }) => {
    const candidates = buildDiscoveryCandidates('Un plat facile', ['breakfast', 'lunch'], mealTimes)

    assert.lengthOf(candidates, 10)
    assert.isTrue(candidates.every((candidate) => candidate.requiredMealTimeSlug === null))
    assert.isTrue(
      candidates.every((candidate) => candidate.prompt.includes('Petit-déjeuner, Déjeuner'))
    )
  })
})
