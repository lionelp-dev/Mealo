/**
 * Gherkin-like helpers pour tests de transformation de données
 *
 * Permet d'écrire des tests dans un style Given-When-Then
 * sans la complexité de Cucumber, focalisé sur les transformations.
 */

type GivenContext = Record<string, unknown>;
type WhenResult = unknown;
type StepFn<T = unknown> = () => T;

interface GherkinTest {
  given: <T extends GivenContext>(
    description: string,
    setup: StepFn<T>,
  ) => GherkinTest & { context: T };
  when: <R = WhenResult>(
    description: string,
    action: (context: GivenContext) => R,
  ) => GherkinTest & { result: R };
  then: (
    description: string,
    assertion: (
      result: WhenResult,
      context: GivenContext,
    ) => void | Promise<void>,
  ) => void | Promise<void>;
  and: (
    description: string,
    assertion: (
      result: WhenResult,
      context: GivenContext,
    ) => void | Promise<void>,
  ) => GherkinTest;
}

/**
 * Crée un test avec syntaxe Gherkin
 *
 * @example
 * test('user can select recipe', () => {
 *   scenario()
 *     .given('mode multi-select activé', () => {
 *       const store = useRecipesMultiSelectStore.getState();
 *       store.setIsMultiSelectMode(true);
 *       return { store };
 *     })
 *     .when('toggle recette 42', ({ store }) => {
 *       store.toggleRecipeSelection(42);
 *       return useRecipesMultiSelectStore.getState();
 *     })
 *     .then('recette 42 est dans selectedRecipeIds', (state) => {
 *       expect(state.selectedRecipeIds).toContain(42);
 *     });
 * });
 */
export function scenario(): GherkinTest {
  let context: GivenContext = {};
  let result: WhenResult;

  const chain: GherkinTest = {
    given<T extends GivenContext>(_description: string, setup: StepFn<T>) {
      context = setup();
      return chain as GherkinTest & { context: T };
    },

    when<R = WhenResult>(
      _description: string,
      action: (ctx: GivenContext) => R,
    ) {
      result = action(context);
      return chain as GherkinTest & { result: R };
    },

    then(
      _description: string,
      assertion: (res: WhenResult, ctx: GivenContext) => void | Promise<void>,
    ) {
      return assertion(result, context);
    },

    and(
      _description: string,
      assertion: (res: WhenResult, ctx: GivenContext) => void | Promise<void>,
    ) {
      assertion(result, context);
      return chain;
    },
  };

  return chain;
}

/**
 * Version alternative avec fonctions globales
 *
 * @example
 * test('filter transformation', () => {
 *   const context = given('aucun filtre actif', () => {
 *     useRecipesFiltersStore.getState().clearAllFilters();
 *     return { store: useRecipesFiltersStore.getState() };
 *   });
 *
 *   const result = when('ajouter filtre breakfast', ({ store }) => {
 *     store.addFilter({ type: 'meal_time', value: '1', label: 'breakfast' });
 *     return useRecipesFiltersStore.getState().activeFilters;
 *   }, context);
 *
 *   then('activeFilters contient breakfast', () => {
 *     expect(result).toContainEqual({ type: 'meal_time', value: '1', label: 'breakfast' });
 *   });
 * });
 */
export function given<T extends GivenContext>(
  _description: string,
  setup: StepFn<T>,
): T {
  return setup();
}

export function when<T, R>(
  _description: string,
  action: (context: T) => R,
  context: T,
): R {
  return action(context);
}

export function then(
  _description: string,
  assertion: () => void | Promise<void>,
): void | Promise<void> {
  return assertion();
}

export function and(
  _description: string,
  assertion: () => void | Promise<void>,
): void | Promise<void> {
  return assertion();
}

/**
 * Helper pour les transformations de données
 * Syntaxe ultra claire: Input → Transform → Output
 *
 * @example
 * test('search query transformation', () => {
 *   transformation({
 *     input: 'pasta carbonara',
 *     transform: (searchQuery) => {
 *       useRecipesSearchStore.getState().setSearchQuery(searchQuery);
 *       // Trigger request coordination
 *       const { result } = renderHook(() => useRecipesRequestCoordination());
 *       act(() => result.current.triggerRecipesRequest());
 *       return router.visit.mock.calls[0][1].data;
 *     },
 *     output: (params) => {
 *       expect(params.search).toBe('pasta carbonara');
 *     },
 *   });
 * });
 */
export function transformation<TInput, TOutput>({
  input,
  transform,
  output,
}: {
  input: TInput;
  transform: (input: TInput) => TOutput;
  output: (result: TOutput) => void | Promise<void>;
}): void | Promise<void> {
  const result = transform(input);
  return output(result);
}
