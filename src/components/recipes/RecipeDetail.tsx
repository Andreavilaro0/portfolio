'use client'

import Link from 'next/link'
import type { Recipe } from '@/data/recipes'

function Stars({ count }: { count: number }) {
  return (
    <span aria-label={`Difficulty: ${count} out of 5 stars`}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-block mb-8 text-sm font-semibold"
        style={{ color: 'var(--color-terracotta)' }}
      >
        &larr; Back to the menu
      </Link>

      {/* Hero image */}
      <div
        className="aspect-video w-full rounded-xl bg-cover bg-center mb-8"
        style={{
          backgroundColor: 'var(--color-flour-white)',
          backgroundImage: `url(${recipe.heroImage})`,
          viewTransitionName: `recipe-hero-${recipe.slug}`,
        }}
      />

      {/* Recipe header */}
      <div className="mb-10">
        <p className="label mb-2">{recipe.category}</p>
        <h1
          className="text-4xl md:text-5xl mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)' }}
        >
          {recipe.title}
        </h1>
        <div className="flex flex-wrap gap-6 label">
          <span>Difficulty: <Stars count={recipe.difficulty} /></span>
          <span>Prep time: {recipe.prepTime}</span>
          <span>Serves: {recipe.serves}</span>
        </div>
        <p className="mt-4 italic" style={{ color: 'var(--color-cocoa)' }}>
          Chef&apos;s note: &ldquo;{recipe.chefNote}&rdquo;
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-10">
        {/* Main column */}
        <div className="cutting-board pl-6 space-y-12">
          {/* Ingredients */}
          <section>
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)' }}
            >
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing) => (
                <li key={ing.name} className="flex gap-2">
                  <span className="font-semibold" style={{ color: 'var(--color-terracotta)' }}>
                    {ing.amount}
                  </span>
                  <span>{ing.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Method */}
          <section>
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)' }}
            >
              Method
            </h2>
            <ol className="space-y-4">
              {recipe.method.map((step, i) => (
                <li key={i}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold" style={{ color: 'var(--color-espresso)' }}>
                      Step {i + 1} — {step.title}
                    </summary>
                    <div className="mt-2 pl-4 border-l-2" style={{ borderColor: 'var(--color-steam-grey)' }}>
                      <p>{step.description}</p>
                      {step.tip && (
                        <blockquote
                          className="mt-2 pl-3 py-1 text-sm rounded"
                          style={{
                            backgroundColor: 'var(--color-flour-white)',
                            fontFamily: 'var(--font-code)',
                            color: 'var(--color-cast-iron)',
                          }}
                        >
                          Chef&apos;s Tip: {step.tip}
                        </blockquote>
                      )}
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          </section>

          {/* Tasting Notes */}
          <section>
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)' }}
            >
              Tasting Notes
            </h2>
            <div className="space-y-4">
              {recipe.tastingNotes.map((note) => (
                <div key={note.label}>
                  <p className="label mb-1">{note.label}</p>
                  <p className="italic">{note.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="label mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: 'var(--color-terracotta)',
                    color: 'var(--color-warm-white)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
