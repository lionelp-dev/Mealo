import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'UI/Input',
} satisfies Meta<Record<string, never>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      {/* Input Sizes */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Input Sizes</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Large"
            className="input-bordered input input-lg w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Medium"
            className="input-bordered input w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Small"
            className="input-bordered input input-sm w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Extra Small"
            className="input-bordered input input-xs w-full max-w-xs"
          />
        </div>
      </div>

      {/* Input Colors */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Input Colors</h3>
        <div className="grid grid-cols-[repeat(3,max-content)] gap-2">
          <input
            type="text"
            placeholder="Neutral"
            className="input-bordered input w-xs"
          />
          <input
            type="text"
            placeholder="Primary"
            className="input-bordered input w-xs input-primary"
          />
          <input
            type="text"
            placeholder="Secondary"
            className="input-bordered input w-xs input-secondary"
          />
          <input
            type="text"
            placeholder="Accent"
            className="input-bordered input w-xs input-accent"
          />
          <input
            type="text"
            placeholder="Info"
            className="input-bordered input w-xs input-info"
          />
          <input
            type="text"
            placeholder="Success"
            className="input-bordered input w-xs input-success"
          />
          <input
            type="text"
            placeholder="Warning"
            className="input-bordered input w-xs input-warning"
          />
          <input
            type="text"
            placeholder="Error"
            className="input-bordered input w-xs input-error"
          />
        </div>
      </div>

      {/* Input States */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Input States</h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Normal"
            className="input-bordered input w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Focused"
            className="input-bordered input w-full max-w-xs input-primary focus:outline-offset-2"
          />
          <input
            type="text"
            placeholder="Disabled"
            className="input-bordered input w-full max-w-xs"
            disabled
          />
          <input
            type="text"
            value="Read only"
            className="input-bordered input w-full max-w-xs"
            readOnly
          />
        </div>
      </div>

      {/* Input Types */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Input Types</h3>
        <div className="grid grid-cols-[repeat(3,max-content)] gap-3">
          <input
            type="text"
            placeholder="Text input"
            className="input-bordered input w-xs"
          />
          <input
            type="email"
            placeholder="Email input"
            className="input-bordered input w-xs"
          />
          <input
            type="password"
            placeholder="Password input"
            className="input-bordered input w-xs"
          />
          <input
            type="number"
            placeholder="Number input"
            className="input-bordered input w-xs"
          />
          <input
            type="tel"
            placeholder="Phone input"
            className="input-bordered input w-xs"
          />
          <input
            type="url"
            placeholder="URL input"
            className="input-bordered input w-xs"
          />
          <input type="date" className="input-bordered input w-xs" />
          <input type="time" className="input-bordered input w-xs" />
        </div>
      </div>

      {/* Input with Labels */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Input with Labels</h3>
        <div className="flex flex-col gap-4">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">What is your name?</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input-bordered input w-full max-w-xs"
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Email</span>
              <span className="label-text-alt">Required</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="input-bordered input w-full max-w-xs input-error"
            />
          </div>
        </div>
      </div>

      {/* Input Groups */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Input Groups</h3>
        <div className="flex flex-col gap-4">
          <div className="join">
            <input
              className="input-bordered input join-item"
              placeholder="Email"
            />
            <button className="btn join-item btn-primary">Subscribe</button>
          </div>

          <div className="join">
            <span className="btn join-item">https://</span>
            <input
              className="input-bordered input join-item flex-1"
              placeholder="mysite"
            />
            <span className="btn join-item">.com</span>
          </div>

          <div className="join">
            <select className="select-bordered select join-item">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <input
              className="input-bordered input join-item flex-1"
              placeholder="Amount"
            />
          </div>
        </div>
      </div>

      {/* Input with Icons */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Input with Icons</h3>
        <div className="flex flex-col gap-4">
          <div className="form-control">
            <label className="input-bordered input flex w-full max-w-xs items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input type="text" className="grow" placeholder="Email" />
            </label>
          </div>

          <div className="form-control">
            <label className="input-bordered input flex w-full max-w-xs items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <input type="text" className="grow" placeholder="Search" />
            </label>
          </div>

          <div className="form-control">
            <label className="input-bordered input flex w-full max-w-xs items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input type="password" className="grow" placeholder="Password" />
            </label>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Textarea</h3>
        <div className="flex flex-col gap-2">
          <textarea
            className="textarea-bordered textarea w-full max-w-xs"
            placeholder="Bio"
          ></textarea>
          <textarea
            className="textarea-bordered textarea w-full max-w-xs textarea-primary"
            placeholder="Primary textarea"
          ></textarea>
          <textarea
            className="textarea-bordered textarea w-full max-w-xs textarea-secondary"
            placeholder="Secondary textarea"
          ></textarea>
          <textarea
            className="textarea-bordered textarea w-full max-w-xs textarea-accent"
            placeholder="Accent textarea"
          ></textarea>
        </div>
      </div>

      {/* File Input */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">File Input</h3>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            className="file-input-bordered file-input w-full max-w-xs"
          />
          <input
            type="file"
            className="file-input-bordered file-input w-full max-w-xs file-input-primary"
          />
          <input
            type="file"
            className="file-input-bordered file-input w-full max-w-xs file-input-secondary"
          />
          <input
            type="file"
            className="file-input-bordered file-input w-full max-w-xs file-input-accent"
          />
        </div>
      </div>
    </div>
  ),
};
