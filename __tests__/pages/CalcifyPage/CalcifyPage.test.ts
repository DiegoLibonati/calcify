import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { Page } from "@/types/pages";

import CalcifyPage from "@/pages/CalcifyPage/CalcifyPage";

const renderPage = (): Page => {
  const element = CalcifyPage();
  document.body.appendChild(element);
  return element;
};

const getDisplay = (): string =>
  document.querySelector<HTMLDivElement>(".calculator__window")!.textContent ||
  "";

describe("CalcifyPage", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render a main element with the calculator class", () => {
      const page = renderPage();
      expect(page.tagName).toBe("MAIN");
      expect(page).toHaveClass("calculator");
    });

    it("should display 0 initially", () => {
      renderPage();
      expect(getDisplay()).toBe("0");
    });

    it("should render all number buttons", () => {
      renderPage();
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].forEach((n) => {
        expect(screen.getByRole("button", { name: n })).toBeInTheDocument();
      });
    });

    it("should render all operation buttons", () => {
      renderPage();
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Subtract" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Multiply" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Divide" })
      ).toBeInTheDocument();
    });

    it("should render all special buttons", () => {
      renderPage();
      expect(
        screen.getByRole("button", { name: "Clear entry" })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Equals" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Percent" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Decimal point" })
      ).toBeInTheDocument();
    });
  });

  describe("number input", () => {
    it("should replace the initial 0 when a number is clicked", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      expect(getDisplay()).toBe("5");
    });

    it("should append digits when multiple numbers are clicked", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "1" }));
      await user.click(screen.getByRole("button", { name: "2" }));
      await user.click(screen.getByRole("button", { name: "3" }));
      expect(getDisplay()).toBe("123");
    });

    it("should stay at 0 when 0 is clicked on the initial display", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "0" }));
      expect(getDisplay()).toBe("0");
    });

    it("should append 0 after a non-zero digit", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "1" }));
      await user.click(screen.getByRole("button", { name: "0" }));
      expect(getDisplay()).toBe("10");
    });

    it("should replace the display after an operation is pending", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      await user.click(screen.getByRole("button", { name: "3" }));
      expect(getDisplay()).toBe("3");
    });

    it("should replace the display with the first digit typed after pressing equals", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      await user.click(screen.getByRole("button", { name: "3" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      await user.click(screen.getByRole("button", { name: "7" }));
      expect(getDisplay()).toBe("7");
    });
  });

  describe("operations", () => {
    it("should show 0 in the display after pressing the first operation", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      expect(getDisplay()).toBe("0");
    });

    it("should update the pending operation when two operations are pressed in a row", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      await user.click(screen.getByRole("button", { name: "Subtract" }));
      await user.click(screen.getByRole("button", { name: "3" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("2");
    });

    it("should compute the intermediate result when chaining operations", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      await user.click(screen.getByRole("button", { name: "3" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      expect(getDisplay()).toBe("8");
    });

    it("should produce the correct result when chaining operations with a final equals", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "2" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      await user.click(screen.getByRole("button", { name: "3" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      await user.click(screen.getByRole("button", { name: "4" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("9");
    });
  });

  describe("equals", () => {
    it("should do nothing when pressed without a pending operation", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("5");
    });

    it("should compute addition", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      await user.click(screen.getByRole("button", { name: "3" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("8");
    });

    it("should compute subtraction", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "9" }));
      await user.click(screen.getByRole("button", { name: "Subtract" }));
      await user.click(screen.getByRole("button", { name: "4" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("5");
    });

    it("should compute multiplication", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "3" }));
      await user.click(screen.getByRole("button", { name: "Multiply" }));
      await user.click(screen.getByRole("button", { name: "4" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("12");
    });

    it("should compute division", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "8" }));
      await user.click(screen.getByRole("button", { name: "Divide" }));
      await user.click(screen.getByRole("button", { name: "2" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("4");
    });

    it("should show 0 when dividing by zero", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Divide" }));
      await user.click(screen.getByRole("button", { name: "0" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("0");
    });

    it("should do nothing when equals is pressed again after a result", async () => {
      renderPage();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      await user.click(screen.getByRole("button", { name: "Add" }));
      await user.click(screen.getByRole("button", { name: "3" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      await user.click(screen.getByRole("button", { name: "Equals" }));
      expect(getDisplay()).toBe("8");
    });
  });

  describe("special keys", () => {
    describe("CE (Clear Entry)", () => {
      it("should reset the display to 0", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "5" }));
        await user.click(screen.getByRole("button", { name: "Clear entry" }));
        expect(getDisplay()).toBe("0");
      });

      it("should preserve the pending operation so the next entry is still computed", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "5" }));
        await user.click(screen.getByRole("button", { name: "Add" }));
        await user.click(screen.getByRole("button", { name: "3" }));
        await user.click(screen.getByRole("button", { name: "Clear entry" }));
        await user.click(screen.getByRole("button", { name: "2" }));
        await user.click(screen.getByRole("button", { name: "Equals" }));
        expect(getDisplay()).toBe("7");
      });
    });

    describe("C (Clear)", () => {
      it("should reset the display to 0", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "5" }));
        await user.click(screen.getByRole("button", { name: "Clear" }));
        expect(getDisplay()).toBe("0");
      });

      it("should clear the pending operation so equals does nothing afterwards", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "5" }));
        await user.click(screen.getByRole("button", { name: "Add" }));
        await user.click(screen.getByRole("button", { name: "3" }));
        await user.click(screen.getByRole("button", { name: "Clear" }));
        await user.click(screen.getByRole("button", { name: "2" }));
        await user.click(screen.getByRole("button", { name: "Equals" }));
        expect(getDisplay()).toBe("2");
      });
    });

    describe("percent", () => {
      it("should convert the displayed value to its percentage equivalent", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "5" }));
        await user.click(screen.getByRole("button", { name: "0" }));
        await user.click(screen.getByRole("button", { name: "Percent" }));
        expect(getDisplay()).toBe("0.5");
      });

      it("should convert 100 to 1", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "1" }));
        await user.click(screen.getByRole("button", { name: "0" }));
        await user.click(screen.getByRole("button", { name: "0" }));
        await user.click(screen.getByRole("button", { name: "Percent" }));
        expect(getDisplay()).toBe("1");
      });
    });

    describe("decimal point", () => {
      it("should append a decimal point to the current display", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "5" }));
        await user.click(screen.getByRole("button", { name: "Decimal point" }));
        expect(getDisplay()).toBe("5.");
      });

      it("should append a decimal point to the initial zero", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "Decimal point" }));
        expect(getDisplay()).toBe("0.");
      });

      it("should not add a second decimal point if one already exists", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "5" }));
        await user.click(screen.getByRole("button", { name: "Decimal point" }));
        await user.click(screen.getByRole("button", { name: "Decimal point" }));
        expect(getDisplay()).toBe("5.");
      });

      it("should allow decimal input followed by digits", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "1" }));
        await user.click(screen.getByRole("button", { name: "Decimal point" }));
        await user.click(screen.getByRole("button", { name: "5" }));
        expect(getDisplay()).toBe("1.5");
      });
    });
  });

  describe("cleanup", () => {
    it("should expose a cleanup method", () => {
      const page = renderPage();
      expect(typeof page.cleanup).toBe("function");
    });

    it("should stop responding to button clicks after cleanup", async () => {
      const page = renderPage();
      page.cleanup?.();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "5" }));
      expect(getDisplay()).toBe("0");
    });
  });
});
