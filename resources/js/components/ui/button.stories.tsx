import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3 p-6">
      <div className="flex flex-wrap items-end gap-2">
        <Button size="lg">🖤 Button</Button>
        <Button>🖤 Button</Button>
        <Button size="sm">🖤 Button</Button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Button variant="secondary" size="lg">
          🖤 Button
        </Button>
        <Button variant="secondary">🖤 Button</Button>
        <Button variant="secondary" size="sm">
          🖤 Button
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Button variant="outline" size="lg">
          🖤 Button
        </Button>
        <Button variant="outline">🖤 Button</Button>
        <Button variant="outline" size="sm">
          🖤 Button
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Button variant="destructive" size="lg">
          🖤 Button
        </Button>
        <Button variant="destructive">🖤 Button</Button>
        <Button variant="destructive" size="sm">
          🖤 Button
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Button variant="ghost" size="lg">
          🖤 Button
        </Button>
        <Button variant="ghost">🖤 Button</Button>
        <Button variant="ghost" size="sm">
          🖤 Button
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Button variant="link" size="lg">
          🖤 Button
        </Button>
        <Button variant="link">🖤 Button</Button>
        <Button variant="link" size="sm">
          🖤 Button
        </Button>
      </div>
    </div>
  ),
};
