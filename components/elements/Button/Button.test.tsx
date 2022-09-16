import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { Button } from "./Button";

describe(`Button Component Tests`, () => {
  test(`Button element rendered component`, async () => {
    render(<Button />);
    const button = screen.getByRole(`button`);
    expect(button).toBeTruthy();
  });
  test(`Button element accepts children`, async () => {
    const text = `test text`;
    render(<Button>{text}</Button>);
    const button = screen.getByRole(`button`);
    expect(button).toHaveTextContent(text);
  });
  test(`Button to accept and call an onClick function `, async () => {
    const mockFn = jest.fn(() => `tested`);
    render(<Button clickHandler={mockFn} />);
    const button = screen.getByRole(`button`);
    await userEvent.click(button);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.results[0].value).toBe(`tested`);
  });
}); // end describe
