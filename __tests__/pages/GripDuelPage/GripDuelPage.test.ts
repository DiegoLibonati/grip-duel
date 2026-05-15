import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { Page } from "@/types/pages";

import GripDuelPage from "@/pages/GripDuelPage/GripDuelPage";

const renderPage = (): Page => {
  const element = GripDuelPage();
  document.body.appendChild(element);
  return element;
};

describe("GripDuelPage", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  describe("rendering", () => {
    it("should render the main element with class game-main", () => {
      renderPage();
      expect(document.querySelector<HTMLElement>("main")).toHaveClass(
        "game-main"
      );
    });

    it("should display the Player heading", () => {
      renderPage();
      expect(screen.getByText("Player")).toBeInTheDocument();
    });

    it("should display the Computer heading", () => {
      renderPage();
      expect(screen.getByText("Computer")).toBeInTheDocument();
    });

    it("should display initial player score as 0", () => {
      renderPage();
      expect(
        document.querySelector<HTMLHeadingElement>("#user-score")
      ).toHaveTextContent("0");
    });

    it("should display initial ia score as 0", () => {
      renderPage();
      expect(
        document.querySelector<HTMLHeadingElement>("#ia-score")
      ).toHaveTextContent("0");
    });

    it("should display Choose an option as initial result text", () => {
      renderPage();
      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    it("should display Make your choice now! as initial description", () => {
      renderPage();
      expect(screen.getByText("Make your choice now!")).toBeInTheDocument();
    });

    it("should render rock, paper and scissor choice buttons", () => {
      renderPage();
      expect(
        screen.getByRole("button", { name: "Choose rock" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Choose paper" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Choose scissor" })
      ).toBeInTheDocument();
    });

    it("should set aria-label to Grip Duel on the main element", () => {
      renderPage();
      expect(
        screen.getByRole("main", { name: "Grip Duel" })
      ).toBeInTheDocument();
    });
  });

  describe("game behavior", () => {
    describe("when user wins", () => {
      it("should display win result text", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0.7);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(screen.getByText(/User Win!/)).toBeInTheDocument();
      });

      it("should increment player score by 1", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0.7);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          document.querySelector<HTMLHeadingElement>("#user-score")
        ).toHaveTextContent("1");
      });

      it("should not increment ia score", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0.7);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          document.querySelector<HTMLHeadingElement>("#ia-score")
        ).toHaveTextContent("0");
      });
    });

    describe("when user loses", () => {
      it("should display lose result text", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0.4);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(screen.getByText(/Ia Win!/)).toBeInTheDocument();
      });

      it("should increment ia score by 1", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0.4);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          document.querySelector<HTMLHeadingElement>("#ia-score")
        ).toHaveTextContent("1");
      });

      it("should not increment player score", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0.4);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          document.querySelector<HTMLHeadingElement>("#user-score")
        ).toHaveTextContent("0");
      });
    });

    describe("when draw", () => {
      it("should display draw result text", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(screen.getByText(/Draw!/)).toBeInTheDocument();
      });

      it("should not increment player score", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          document.querySelector<HTMLHeadingElement>("#user-score")
        ).toHaveTextContent("0");
      });

      it("should not increment ia score", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          document.querySelector<HTMLHeadingElement>("#ia-score")
        ).toHaveTextContent("0");
      });
    });

    describe("after a choice is made", () => {
      it("should disable all choice buttons", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        const choices =
          document.querySelectorAll<HTMLImageElement>(".game__choice");
        choices.forEach((choice) => {
          expect(choice.style.pointerEvents).toBe("none");
        });
      });

      it("should clear the description text", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0.7);
        renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          screen.queryByText("Make your choice now!")
        ).not.toBeInTheDocument();
      });

      it("should accumulate score across multiple rounds", async () => {
        const user = userEvent.setup();
        jest.spyOn(Math, "random").mockReturnValue(0.7);
        renderPage();

        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          document.querySelector<HTMLHeadingElement>("#user-score")
        ).toHaveTextContent("1");

        const choices =
          document.querySelectorAll<HTMLImageElement>(".game__choice");
        choices.forEach((choice) => {
          choice.style.pointerEvents = "auto";
        });

        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        expect(
          document.querySelector<HTMLHeadingElement>("#user-score")
        ).toHaveTextContent("2");
      });
    });
  });

  describe("reset behavior", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should reset result text to Choose an option after 2500ms", async () => {
      const user = userEvent.setup({ delay: null });
      jest.spyOn(Math, "random").mockReturnValue(0);
      renderPage();
      await user.click(screen.getByRole("button", { name: "Choose rock" }));
      jest.advanceTimersByTime(2500);
      await Promise.resolve();
      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    it("should re-enable choice buttons after 2500ms", async () => {
      const user = userEvent.setup({ delay: null });
      jest.spyOn(Math, "random").mockReturnValue(0);
      renderPage();
      await user.click(screen.getByRole("button", { name: "Choose rock" }));
      jest.advanceTimersByTime(2500);
      await Promise.resolve();
      const choices =
        document.querySelectorAll<HTMLImageElement>(".game__choice");
      choices.forEach((choice) => {
        expect(choice.style.pointerEvents).toBe("auto");
      });
    });

    it("should restore Make your choice now! description after 2500ms", async () => {
      const user = userEvent.setup({ delay: null });
      jest.spyOn(Math, "random").mockReturnValue(0);
      renderPage();
      await user.click(screen.getByRole("button", { name: "Choose rock" }));
      jest.advanceTimersByTime(2500);
      await Promise.resolve();
      expect(screen.getByText("Make your choice now!")).toBeInTheDocument();
    });
  });

  describe("cleanup", () => {
    it("should disconnect the mutation observer on cleanup", () => {
      const disconnectSpy = jest.spyOn(
        MutationObserver.prototype,
        "disconnect"
      );
      const element = renderPage();
      element.cleanup?.();
      expect(disconnectSpy).toHaveBeenCalled();
    });

    it("should not respond to choice clicks after cleanup", async () => {
      const user = userEvent.setup();
      jest.spyOn(Math, "random").mockReturnValue(0);
      const element = renderPage();
      element.cleanup?.();
      await user.click(screen.getByRole("button", { name: "Choose rock" }));
      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    describe("when a reset timer is pending", () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it("should cancel the pending reset timer", async () => {
        const user = userEvent.setup({ delay: null });
        jest.spyOn(Math, "random").mockReturnValue(0);
        const element = renderPage();
        await user.click(screen.getByRole("button", { name: "Choose rock" }));
        element.cleanup?.();
        jest.advanceTimersByTime(2500);
        await Promise.resolve();
        expect(screen.getByText(/Draw!/)).toBeInTheDocument();
      });
    });
  });
});
