import { Typography } from './Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Choisissez \`variant\` selon le rôle du contenu : display, heading, title, body-xs, body-sm, body, body-lg, body-xl, body-2xl, label, caption, overline, code ou quote. Chaque rôle porte sa propre taille dans la charte.

Utilisez le rôle approprié plutôt que de surcharger son échelle. Cela garde la hiérarchie lisible et homogène entre les écrans.`,
      },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

const roles = [
  { variant: 'display', as: 'h1', children: 'Une semaine mieux organisée' },
  { variant: 'heading', as: 'h2', children: 'Vos repas' },
  { variant: 'title', as: 'h3', children: 'Déjeuner du lundi' },
  {
    variant: 'body-xs',
    as: 'p',
    children: 'Un texte très compact, pour les informations secondaires.',
  },
  {
    variant: 'body-sm',
    as: 'p',
    children: 'Un texte secondaire plus compact.',
  },
  {
    variant: 'body',
    as: 'p',
    children: 'Un texte de lecture courant, confortable et lisible.',
  },
  {
    variant: 'body-lg',
    as: 'p',
    children: 'Un texte de lecture plus généreux.',
  },
  {
    variant: 'body-xl',
    as: 'p',
    children: 'Un texte d’introduction plus affirmé.',
  },
  {
    variant: 'body-2xl',
    as: 'p',
    children: 'Un texte d’introduction particulièrement mis en avant.',
  },
  { variant: 'label', as: 'p', children: 'Nom de la recette' },
  { variant: 'caption', as: 'p', children: 'Mis à jour il y a 5 minutes' },
  { variant: 'overline', as: 'p', children: 'Espace de travail' },
  { variant: 'code', as: 'code', children: 'pnpm types' },
  {
    variant: 'quote',
    as: 'blockquote',
    children: 'Planifier, c’est déjà cuisiner un peu.',
  },
] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <Typography as="h2" variant="title">
          Rôles
        </Typography>
        <div className="space-y-4">
          {roles.map(({ variant, as, children }) => (
            <div key={variant} className="space-y-1">
              <Typography as="p" variant="caption" tone="muted">
                {variant}
              </Typography>
              <Typography as={as} variant={variant}>
                {children}
              </Typography>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Typography as="h2" variant="title">
          Tailles
        </Typography>
        <div className="space-y-2">
          {(
            [
              'xs',
              'sm',
              'base',
              'lg',
              'xl',
              '2xl',
              '3xl',
              '4xl',
              '5xl',
              '6xl',
              '7xl',
              '8xl',
              '9xl',
            ] as const
          ).map((size) => (
            <Typography key={size} size={size}>
              Taille : {size}
            </Typography>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Typography as="h2" variant="title">
          Tons
        </Typography>
        <div className="space-y-2">
          {(
            [
              'default',
              'muted',
              'primary',
              'secondary',
              'success',
              'warning',
              'error',
              'inverse',
              'inherit',
            ] as const
          ).map((tone) => (
            <Typography
              key={tone}
              tone={tone}
              className={
                tone === 'inverse'
                  ? 'inline-block bg-primary px-2 py-1'
                  : undefined
              }
            >
              Ton : {tone}
            </Typography>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Typography as="h2" variant="title">
          Graisses
        </Typography>
        <div className="space-y-2">
          {(['regular', 'medium', 'semibold', 'bold'] as const).map(
            (weight) => (
              <Typography key={weight} weight={weight}>
                Graisse : {weight}
              </Typography>
            ),
          )}
        </div>
      </section>
    </div>
  ),
};
