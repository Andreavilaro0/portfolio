'use client'

import { recipes } from '@/data/recipes'
import { RecipeCard } from './RecipeCard'

export function RecipeGrid() {
  return (
    <section id="recipes" className="max-w-6xl mx-auto px-6 py-16">
      <h2
        className="text-3xl md:text-4xl mb-2 text-center"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)' }}
      >
        The Full Menu
      </h2>
      <p className="text-center mb-12" style={{ color: 'var(--color-cocoa)' }}>
        All recipes, sorted by season. Each one taught me something different about building things people use.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
    </section>
  )
}
