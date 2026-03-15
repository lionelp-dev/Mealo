import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'UI/Button',
} satisfies Meta<Record<string, never>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      {/* Button Sizes */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Button Sizes</h3>
        <div className="flex flex-wrap items-end gap-2">
          <button className="btn btn-xs">Extra Small</button>
          <button className="btn btn-sm">Small</button>
          <button className="btn">Medium</button>
          <button className="btn btn-lg">Large</button>
        </div>
      </div>

      {/* Button Colors */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Button Colors</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn">Default</button>
          <button className="btn btn-neutral">Neutral</button>
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-info">Info</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-error">Error</button>
        </div>
      </div>

      {/* Outline Buttons */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Outline Buttons</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-outline">Default</button>
          <button className="btn btn-outline btn-primary">Primary</button>
          <button className="btn btn-outline btn-secondary">Secondary</button>
          <button className="btn btn-outline btn-accent">Accent</button>
          <button className="btn btn-outline btn-info">Info</button>
          <button className="btn btn-outline btn-success">Success</button>
          <button className="btn btn-outline btn-warning">Warning</button>
          <button className="btn btn-outline btn-error">Error</button>
        </div>
      </div>

      {/* Ghost & Link Buttons */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Ghost & Link Buttons</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-ghost">Ghost Button</button>
          <button className="btn btn-link">Link Button</button>
        </div>
      </div>

      {/* Buttons with Icons */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Buttons with Icons</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            Like
          </button>
          <button className="btn btn-primary">
            Download
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
          <button className="btn btn-square btn-outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <button className="btn btn-circle btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Buttons with Loading Spinner */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">
          Buttons with Loading Spinner
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn">
            <span className="loading loading-spinner"></span>
            Loading
          </button>
          <button className="btn btn-primary">
            <span className="loading loading-spinner"></span>
            Saving
          </button>
          <button className="btn btn-square">
            <span className="loading loading-spinner"></span>
          </button>
        </div>
      </div>

      {/* Button Shapes */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Button Shapes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-wide">Wide Button</button>
          <button className="btn btn-square">S</button>
          <button className="btn btn-circle">C</button>
        </div>
        <div className="mt-2">
          <button className="btn btn-block">Block Button (Full Width)</button>
        </div>
      </div>

      {/* Button States */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Button States</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-active btn-primary">Active State</button>
          <button className="btn-disabled btn">Disabled State</button>
          <button className="btn" disabled>
            Disabled Attribute
          </button>
        </div>
      </div>
    </div>
  ),
};
