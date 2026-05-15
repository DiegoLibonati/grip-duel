import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { ChoiceProps } from "@/types/props";
import type { ChoiceComponent } from "@/types/components";

import Choice from "@/components/Choice/Choice";

const mockOnClick = jest.fn();

const defaultProps: ChoiceProps = {
  id: "rock",
  name: "rock",
  srcImg: "/images/rock.png",
  onClick: mockOnClick,
};

const renderComponent = (props: Partial<ChoiceProps> = {}): ChoiceComponent => {
  const element = Choice({ ...defaultProps, ...props });
  document.body.appendChild(element);
  return element;
};

describe("Choice", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render an image with role button and aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Choose rock" })
      ).toBeInTheDocument();
    });

    it("should set the correct id", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Choose rock" })
      ).toHaveAttribute("id", "rock");
    });

    it("should set the correct src", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Choose rock" })
      ).toHaveAttribute("src", "/images/rock.png");
    });

    it("should set the alt text to the name", () => {
      renderComponent();
      expect(screen.getByAltText("rock")).toBeInTheDocument();
    });

    it("should apply the base class game__choice", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Choose rock" })).toHaveClass(
        "game__choice"
      );
    });

    it("should append a custom className when provided", () => {
      renderComponent({ className: "rock-img" });
      expect(screen.getByRole("button", { name: "Choose rock" })).toHaveClass(
        "rock-img"
      );
    });

    it("should set tabindex to 0", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Choose rock" })
      ).toHaveAttribute("tabindex", "0");
    });

    it("should set aria-label to Choose followed by the name", () => {
      renderComponent({ name: "paper", id: "paper" });
      expect(
        screen.getByRole("button", { name: "Choose paper" })
      ).toHaveAttribute("aria-label", "Choose paper");
    });
  });

  describe("behavior", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole("button", { name: "Choose rock" }));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick with the mouse event", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole("button", { name: "Choose rock" }));
      expect(mockOnClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it("should call onClick for each click when clicked multiple times", async () => {
      const user = userEvent.setup();
      renderComponent();
      const button = screen.getByRole("button", { name: "Choose rock" });
      await user.click(button);
      await user.click(button);
      await user.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("cleanup", () => {
    it("should not call onClick after cleanup is called", async () => {
      const user = userEvent.setup();
      const element = renderComponent();
      element.cleanup?.();
      await user.click(element);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
