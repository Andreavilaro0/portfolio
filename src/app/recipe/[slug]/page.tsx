import { notFound } from 'next/navigation'
import { recipes } from '@/data/recipes'
import { RecipeDetail } from '@/components/recipes/RecipeDetail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }))
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params
  const recipe = recipes.find((r) => r.slug === slug)
  if (!recipe) notFound()

  return <RecipeDetail recipe={recipe} />
}
