"use client";

import { useCallback, useMemo, useState } from "react";
import { AppDataProvider, useAppData } from "@/contexts/app-data-context";
import { useScrollChrome } from "@/hooks/use-scroll-chrome";
import { getTelegram } from "@/lib/telegram";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { BackgroundCanvas } from "@/components/layout/background-canvas";
import { AppHeader } from "@/components/layout/app-header";
import {
  BottomNav,
  type MainView,
  useBottomNavPill,
} from "@/components/layout/bottom-nav";
import { Loader } from "@/components/feedback/loader";
import { Toast, useToastState } from "@/components/feedback/toast";
import { ProfileView } from "@/components/profile/profile-view";
import { IdeasView } from "@/components/ideas/ideas-view";
import { HubView } from "@/components/hub/hub-view";
import { IdeaSheet } from "@/components/modals/idea-sheet";
import { InfoSheet } from "@/components/modals/info-sheet";
import { ProfitDetailSheet } from "@/components/modals/profit-detail-sheet";
import { ProfileDetailSheet } from "@/components/modals/profile-detail-sheet";
import { ServiceDetailContent } from "@/components/service/service-detail-content";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import type { ServiceRow } from "@/types/models";

const SUBTITLE: Record<MainView, string> = {
  analytics: "сводка, графики и история",
  profile: "баланс, рефералы и наставники",
  ideas: "предложения и голосования",
  hub: "сервисы, материалы и чаты",
};

function ShellInner() {
  const {
    ready,
    dbOk,
    uid,
    uname,
    uphoto,
    users,
    profits,
    refs,
    refP,
    services,
    resources,
    myMentors,
    mentorsCatalog,
    me,
  } = useAppData();

  const { hdrHidden, hdrScrolled, resetChrome } = useScrollChrome();
  const { toast, showToast } = useToastState();

  const [view, setView] = useState<MainView>("analytics");
  const { navRef, pill } = useBottomNavPill(view);

  const [ideaOpen, setIdeaOpen] = useState(false);
  const [profitId, setProfitId] = useState<string | number | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [hubInfo, setHubInfo] = useState<ServiceRow | null>(null);

  const hdrClass = `${hdrHidden ? "hide" : ""} ${hdrScrolled ? "scrolled" : ""}`.trim();

  const go = useCallback(
    (v: MainView) => {
      getTelegram()?.HapticFeedback?.selectionChanged();
      resetChrome();
      setView(v);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [resetChrome],
  );

  const openProfile = useCallback((id: string) => {
    setProfileUserId(id);
  }, []);

  const bal = parseFloat(String(me?.balance_usd ?? 0));

  const hubModalOpen = Boolean(hubInfo);

  const infoBody = useMemo(() => {
    if (!hubInfo) return null;
    const idx = services.findIndex(
      (s) =>
        (hubInfo.id != null && String(s.id) === String(hubInfo.id)) ||
        Boolean(s.name && hubInfo.name && s.name === hubInfo.name),
    );
    return (
      <ServiceDetailContent
        service={hubInfo}
        profits={profits}
        mentorsCatalog={mentorsCatalog}
        colorIndex={idx >= 0 ? idx : 0}
      />
    );
  }, [hubInfo, profits, mentorsCatalog, services]);

  if (!ready) {
    return <Loader visible />;
  }

  return (
    <>
      <BackgroundCanvas />
      <Toast
        message={toast.msg}
        kind={toast.kind}
        visible={toast.show}
      />

      <div className="shell">
        <AppHeader
          name={uname}
          subtitle={SUBTITLE[view]}
          photoUrl={uphoto}
          balanceUsd={bal}
          onAvatarClick={() => go("profile")}
          hdrClassName={hdrClass}
        />

        {!dbOk ? (
          <div className="banner" style={{ marginTop: 12 }}>
            <p>
              <strong>Нет подключения к Supabase.</strong> Задайте{" "}
              <code style={{ fontSize: 11 }}>NEXT_PUBLIC_SUPABASE_URL</code> и{" "}
              <code style={{ fontSize: 11 }}>
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              в <code style={{ fontSize: 11 }}>.env.local</code>.
            </p>
          </div>
        ) : null}

        <div
          id="v-analytics"
          className={`view${view === "analytics" ? " on" : ""}`.trim()}
        >
          <ErrorBoundary>
            <AnalyticsView
              profits={profits}
              users={users}
              uid={uid}
              headerChromeHidden={hdrHidden}
              onOpenProfile={openProfile}
              onOpenProfit={(id) => setProfitId(id)}
            />
          </ErrorBoundary>
        </div>

        <div
          id="v-profile"
          className={`view${view === "profile" ? " on" : ""}`.trim()}
        >
          <ErrorBoundary>
            <ProfileView
              me={me}
              uid={uid}
              profits={profits}
              allProfits={profits}
              refs={refs}
              refP={refP}
              myMentors={myMentors}
              showToast={showToast}
            />
          </ErrorBoundary>
        </div>

        <div id="v-ideas" className={`view${view === "ideas" ? " on" : ""}`.trim()}>
          <ErrorBoundary>
            <IdeasView onOpenNewIdea={() => setIdeaOpen(true)} />
          </ErrorBoundary>
        </div>

        <div id="v-hub" className={`view${view === "hub" ? " on" : ""}`.trim()}>
          <ErrorBoundary>
            <HubView
              services={services}
              resources={resources}
              onServiceClick={(s) => setHubInfo(s)}
            />
          </ErrorBoundary>
        </div>
      </div>

      <BottomNav
        active={view}
        onChange={(v) => go(v)}
        navRef={navRef}
        pill={pill}
      />

      <IdeaSheet
        open={ideaOpen}
        onClose={() => setIdeaOpen(false)}
        showToast={showToast}
      />

      <InfoSheet
        open={hubModalOpen}
        title={hubInfo?.name ? String(hubInfo.name) : "Сервис"}
        onClose={() => setHubInfo(null)}
      >
        {infoBody}
      </InfoSheet>

      <ProfitDetailSheet
        profitId={profitId}
        onClose={() => setProfitId(null)}
        onOpenProfile={(id) => setProfileUserId(id)}
      />

      <ProfileDetailSheet
        userId={profileUserId}
        onClose={() => setProfileUserId(null)}
      />
    </>
  );
}

export function AppShell() {
  return (
    <AppDataProvider>
      <ShellInner />
    </AppDataProvider>
  );
}
