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

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipe/${recipe.slug}`} className="group block">
      <article
        className="glass-card relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* Thumbnail */}
        <div
          className="aspect-video w-full bg-cover bg-center"
          style={{
            backgroundColor: 'var(--color-flour-white)',
            backgroundImage: `url(${recipe.thumbnail})`,
            viewTransitionName: `recipe-hero-${recipe.slug}`,
          }}
        />

        {/* Content */}
        <div className="p-5">
          <h3
            className="text-xl mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)' }}
          >
            {recipe.title}
          </h3>

          <div className="space-y-1 text-sm">
            <p className="label">
              Difficulty: <Stars count={recipe.difficulty} />
            </p>
            <p className="label">Prep time: {recipe.prepTime}</p>
            <p className="label">Serves: {recipe.serves}</p>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--color-flour-white)',
                  color: 'var(--color-cocoa)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Steam particles (5) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="steam-particle"
            style={{
              top: 0,
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </article>
    </Link>
  )
}
