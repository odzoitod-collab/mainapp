"use client";

import { useState } from "react";
import {
  IcoChevronRight,
  IcoExternalLink,
  IcoFolder,
  IcoHubClock,
  IcoTabChats,
  IcoTabMaterials,
  IcoTabServices,
  IcoWrench,
} from "@/components/icons/app-icons";
import { ServiceIcon } from "@/components/service/service-icon";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import type { ResourceRow, ServiceRow } from "@/types/models";

const HUB_COLS = ["#3b5bdb", "#7048e8", "#0ca678", "#e67700", "#c92a2a"];

type Sub = "svc" | "res" | "chat";

type Props = {
  services: ServiceRow[];
  resources: ResourceRow[];
  onServiceClick: (s: ServiceRow) => void;
};

function HubLinks({ items }: { items: ResourceRow[] }) {
  if (!items.length)
    return <EmptyState icon={<IcoFolder size={24} />} text="Пусто" />;
  return (
    <>
      {items.map((r) => (
        <Reveal key={String(r.id ?? r.title)}>
          <a
            href={r.content_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="li"
          >
            <div className="li-ico li-ico--link" style={{ background: "var(--blue-s)" }}>
              <IcoExternalLink size={18} className="li-ico__svg li-ico__svg--blue" />
            </div>
            <div className="li-body">
              <div className="li-t">{r.title}</div>
              <div className="li-s">Ссылка · IRL Hub</div>
            </div>
            <div className="li-arr">
              <IcoChevronRight size={12} />
            </div>
          </a>
        </Reveal>
      ))}
    </>
  );
}

export function HubView({ services, resources, onServiceClick }: Props) {
  const [sub, setSub] = useState<Sub>("svc");
  const resF = resources.filter((r) => r.type === "resource");
  const chatF = resources.filter((r) => r.type === "community");

  return (
    <>
      <div className="tabs tabs--hub" role="tablist" aria-label="Разделы хаба">
        <button
          type="button"
          role="tab"
          aria-selected={sub === "svc"}
          className={`tab tab--ico${sub === "svc" ? " on" : ""}`}
          onClick={() => setSub("svc")}
        >
          <IcoTabServices size={16} />
          <span>Сервисы</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sub === "res"}
          className={`tab tab--ico${sub === "res" ? " on" : ""}`}
          onClick={() => setSub("res")}
        >
          <IcoTabMaterials size={16} />
          <span>Материалы</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sub === "chat"}
          className={`tab tab--ico${sub === "chat" ? " on" : ""}`}
          onClick={() => setSub("chat")}
        >
          <IcoTabChats size={16} />
          <span>Чаты</span>
        </button>
      </div>

      <Reveal className="banner banner--hub">
        <IcoHubClock size={22} className="banner--hub__ico" />
        <p>
          <strong>IRL Hub</strong> — каталог сервисов, обучающих материалов и
          чатов команды. Откройте сервис, чтобы увидеть статистику и наставников.
        </p>
      </Reveal>

      <div
        id="sv-hub-svc"
        className={`subview${sub === "svc" ? " on" : ""}`.trim()}
      >
        <div className="list">
          <div className="hub-lbl">Каталог · нажмите для деталей и статистики</div>
          {services.length === 0 ? (
            <EmptyState icon={<IcoWrench size={24} />} text="Нет сервисов" />
          ) : (
            services.map((s, i) => {
              const col = HUB_COLS[i % HUB_COLS.length];
              return (
                <Reveal key={String(s.id ?? s.name ?? i)}>
                  <button
                    type="button"
                    className="li hub-svc"
                    style={{ cursor: "pointer", width: "100%", border: "none" }}
                    onClick={() => onServiceClick(s)}
                  >
                    <div
                      className="li-ico li-ico--hub-svc"
                      style={{
                        background: `${col}18`,
                        borderColor: `${col}30`,
                        color: col,
                      }}
                    >
                      <ServiceIcon icon={s.icon} accent={col} />
                    </div>
                    <div className="li-body">
                      <div className="li-t">{s.name || "Сервис"}</div>
                      <div className="li-s">
                        {(s.description || "IRL сервис").slice(0, 90)}
                      </div>
                    </div>
                    <div className="li-arr">
                      <IcoChevronRight size={12} />
                    </div>
                  </button>
                </Reveal>
              );
            })
          )}
        </div>
      </div>
      <div
        id="sv-hub-res"
        className={`subview${sub === "res" ? " on" : ""}`.trim()}
      >
        <div className="list">
          <div className="hub-lbl">Материалы</div>
          <HubLinks items={resF} />
        </div>
      </div>
      <div
        id="sv-hub-chat"
        className={`subview${sub === "chat" ? " on" : ""}`.trim()}
      >
        <div className="list">
          <div className="hub-lbl">Сообщества</div>
          <HubLinks items={chatF} />
        </div>
      </div>
    </>
  );
}
