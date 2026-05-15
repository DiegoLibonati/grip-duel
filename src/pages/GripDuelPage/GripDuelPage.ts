import { Result } from "@/types/enums";
import type { Page } from "@/types/pages";

import Choice from "@/components/Choice/Choice";

import { iaChoices } from "@/constants/vars";

import { getResult } from "@/helpers/getResult";

import assets from "@/assets/index";

import "@/pages/GripDuelPage/GripDuelPage.css";

const GripDuelPage = (): Page => {
  const main = document.createElement("main") as Page;
  main.className = "game-main";
  main.setAttribute("aria-label", "Grip Duel");

  main.innerHTML = `
    <section class="game">
        <article class="game__header" aria-label="Scoreboard">
            <div class="game__header-user">
                <h2 class="game__player-name">Player</h2>
                <h3 class="game__player-score" id="user-score" aria-label="Player score">0</h3>
            </div>
            <div class="game__header-ia">
                <h2 class="game__ia-name">Computer</h2>
                <h3 class="game__ia-score" id="ia-score" aria-label="Computer score">0</h3>
            </div>
        </article>

        <article class="game__content">
            <h2 id="text-result" class="game__result-text" aria-live="polite" aria-atomic="true">Choose an option</h2>

            <div class="game__choices" role="group" aria-label="Choose your move">
            </div>

            <h2 id="text-play" class="game__description">
                Make your choice now!
            </h2>
        </article>
    </section>
  `;

  const gameChoices = main.querySelector<HTMLDivElement>(".game__choices");
  const textResult =
    main.querySelector<HTMLHeadingElement>(".game__result-text");

  let timeout: number | null = null;

  const getUserChoice = (e: MouseEvent): void => {
    const imgsUserOptions =
      main.querySelectorAll<HTMLImageElement>(".game__choice");
    const textPlay =
      main.querySelector<HTMLHeadingElement>(".game__description");
    const scorePlayer = main.querySelector<HTMLHeadingElement>(
      ".game__player-score"
    );
    const scoreIA = main.querySelector<HTMLHeadingElement>(".game__ia-score");
    const textResult =
      main.querySelector<HTMLHeadingElement>(".game__result-text");

    if (!textPlay || !scorePlayer || !scoreIA || !textResult) return;

    const target = e.target as HTMLImageElement;

    const optionUserChoice = target.id;
    const optionIaChoice =
      iaChoices[Math.floor(Math.random() * iaChoices.length)]!;

    const userResult = getResult(optionUserChoice, optionIaChoice);

    imgsUserOptions.forEach((btnUserOption) => {
      btnUserOption.style.pointerEvents = "none";
    });

    textPlay.textContent = "";

    if (userResult === Result.Win) {
      textResult.textContent = `User choose: ${optionUserChoice} | Ia choose: ${optionIaChoice} | User Win!`;
      scorePlayer.textContent = `${Number(scorePlayer.textContent) + 1}`;
      return;
    }

    if (userResult === Result.Lose) {
      textResult.textContent = `User choose: ${optionUserChoice} | Ia choose: ${optionIaChoice} | Ia Win!`;
      scoreIA.textContent = `${Number(scoreIA.textContent) + 1}`;
      return;
    }

    textResult.textContent = `User choose: ${optionUserChoice} | Ia choose: ${optionIaChoice} | Draw!`;
  };

  const resetToPlay = (): void => {
    const imgsUserOptions =
      main.querySelectorAll<HTMLImageElement>(".game__choice");
    const textPlay =
      main.querySelector<HTMLHeadingElement>(".game__description");
    const textResult =
      main.querySelector<HTMLHeadingElement>(".game__result-text");

    if (!textPlay || !textResult) return;

    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(() => {
      if (textResult.textContent === "Choose an option") {
        timeout = null;
        return;
      }

      imgsUserOptions.forEach((imgUserOption) => {
        imgUserOption.style.pointerEvents = "auto";
      });

      textPlay.textContent = "Make your choice now!";
      textResult.textContent = "Choose an option";
      timeout = null;
    }, 2500);
  };

  const rock = Choice({
    id: "rock",
    name: "rock",
    srcImg: assets.images.RockPng,
    onClick: (e) => {
      getUserChoice(e);
    },
  });

  const paper = Choice({
    id: "paper",
    name: "paper",
    srcImg: assets.images.PaperPng,
    onClick: (e) => {
      getUserChoice(e);
    },
  });

  const scissor = Choice({
    id: "scissor",
    name: "scissor",
    srcImg: assets.images.ScissorPng,
    onClick: (e) => {
      getUserChoice(e);
    },
  });

  gameChoices?.append(rock, paper, scissor);

  const observer = new MutationObserver(() => {
    resetToPlay();
  });

  if (textResult) {
    observer.observe(textResult, {
      childList: true,
    });
  }

  main.cleanup = (): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }

    observer.disconnect();

    rock.cleanup?.();
    paper.cleanup?.();
    scissor.cleanup?.();
  };

  return main;
};

export default GripDuelPage;
