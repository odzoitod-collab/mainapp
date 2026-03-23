"use client";

import type { RefObject } from "react";
import {
  IcoNavAnalytics,
  IcoNavHub,
  IcoNavIdeas,
  IcoNavProfile,
} from "@/components/icons/app-icons";
import { HAPTIC, useHaptic } from "@/hooks/use-haptic";
import { useNavPill } from "@/hooks/use-nav-pill";

export type MainView = "analytics" | "profile" | "ideas" | "hub";

type Props = {
  active: MainView;
  onChange: (v: MainView) => void;
  navRef: RefObject<HTMLElement | null>;
  pill: { left: number; width: number };
};

const NAV: {
  id: MainView;
  label: string;
  hint: string;
  Icon: typeof IcoNavAnalytics;
}[] = [
  {
    id: "analytics",
    label: "аналитика",
    hint: "Графики, доход и рейтинг",
    Icon: IcoNavAnalytics,
  },
  {
    id: "profile",
    label: "профиль",
    hint: "Ваш кабинет и рефералы",
    Icon: IcoNavProfile,
  },
  {
    id: "ideas",
    label: "идеи",
    hint: "Идеи и опросы команды",
    Icon: IcoNavIdeas,
  },
  {
    id: "hub",
    label: "хаб",
    hint: "Сервисы и материалы",
    Icon: IcoNavHub,
  },
];

export function BottomNav({ active, onChange, navRef, pill }: Props) {
  const haptic = useHaptic();

  const handleChange = (v: MainView) => {
    haptic(HAPTIC.nav);
    onChange(v);
  };

  return (
    <div className="nav-wrap">
      <nav
        className="nav"
        id="navIsland"
        ref={navRef as RefObject<HTMLDivElement>}
        aria-label="Основные разделы"
      >
        <div
          className="nav-pill"
          style={{ left: pill.left, width: pill.width }}
          aria-hidden
        />
        {NAV.map(({ id, label, hint, Icon }) => (
          <button
            key={id}
            type="button"
            className={`nav-btn${active === id ? " on" : ""}`}
            data-n={id}
            title={hint}
            aria-label={hint}
            aria-current={active === id ? "page" : undefined}
            onClick={() => handleChange(id)}
          >
            <Icon size={20} />
            <span className="nav-btn__label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const ORDER: MainView[] = ["analytics", "profile", "ideas", "hub"];

export function useBottomNavPill(active: MainView) {
  const idx = ORDER.indexOf(active);
  return useNavPill(idx >= 0 ? idx : 0);
}
