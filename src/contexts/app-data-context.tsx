"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase } from "@/lib/supabase/client";
import { getTelegram, initTelegramChrome } from "@/lib/telegram";
import type {
  AppUser,
  IdeaRow,
  MentorCatalogRow,
  MentorRow,
  ProfitRow,
  ReferralProfitRow,
  ReferralUser,
  ResourceRow,
  ServiceRow,
} from "@/types/models";

type UsersMap = Record<string, AppUser>;

export type AppDataContextValue = {
  ready: boolean;
  dbOk: boolean;
  uid: number;
  uname: string;
  uphoto: string;
  users: UsersMap;
  profits: ProfitRow[];
  ideas: IdeaRow[];
  refs: ReferralUser[];
  refP: ReferralProfitRow[];
  services: ServiceRow[];
  resources: ResourceRow[];
  myMentors: MentorRow[];
  mentorsCatalog: MentorCatalogRow[];
  me: AppUser | undefined;
  refresh: () => Promise<void>;
  setIdeas: React.Dispatch<React.SetStateAction<IdeaRow[]>>;
  likeIdea: (id: string | number) => Promise<void>;
  votePoll: (ideaId: string | number, optionIndex: number) => Promise<void>;
  submitIdea: (payload: {
    category: string;
    content: string;
  }) => Promise<IdeaRow | null>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [dbOk, setDbOk] = useState(true);
  const [users, setUsers] = useState<UsersMap>({});
  const [profits, setProfits] = useState<ProfitRow[]>([]);
  const [ideas, setIdeas] = useState<IdeaRow[]>([]);
  const [refs, setRefs] = useState<ReferralUser[]>([]);
  const [refP, setRefP] = useState<ReferralProfitRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [myMentors, setMyMentors] = useState<MentorRow[]>([]);
  const [mentorsCatalog, setMentorsCatalog] = useState<MentorCatalogRow[]>([]);

  const tg = typeof window !== "undefined" ? getTelegram() : undefined;
  const uid = tg?.initDataUnsafe?.user?.id ?? 0;
  const uname = tg?.initDataUnsafe?.user?.first_name ?? "Guest";
  const uphoto = tg?.initDataUnsafe?.user?.photo_url ?? "";

  const me = users[String(uid)];

  const load = useCallback(async () => {
    const db = getSupabase();
    if (!db) {
      setDbOk(false);
      setReady(true);
      return;
    }

    const [
      uR,
      pR,
      iR,
      rR,
      rpR,
      sR,
      resR,
      umR,
    ] = await Promise.all([
      db.from("users").select("*").range(0, 1999),
      db
        .from("profits")
        .select("*")
        .order("created_at", { ascending: false })
        .range(0, 4999),
      db.from("ideas").select("*").order("created_at", { ascending: false }),
      db
        .from("users")
        .select("id,username,full_name,created_at,status")
        .eq("referrer_id", uid),
      db.from("referral_profits").select("*").eq("referrer_id", uid),
      db.from("services").select("*").eq("is_active", true).order("name"),
      db.from("resources").select("*").eq("is_active", true).order("type"),
      db.from("user_mentors").select("mentor_id").eq("user_id", uid),
    ]);

    const uMap: UsersMap = {};
    (uR.data as AppUser[] | null)?.forEach((u) => {
      uMap[String(u.id)] = u;
    });

    const { data: mentorsCatRaw } = await db
      .from("mentors")
      .select(
        "id,user_id,service_name,percent,rating,students_count,total_earned,is_active,telegram_channel,channel_invite_link",
      )
      .eq("is_active", true)
      .limit(1000);

    const mentorsList = (mentorsCatRaw as MentorCatalogRow[]) || [];
    const catUids = [...new Set(mentorsList.map((m) => String(m.user_id)))];
    const missingUids = catUids.filter((id) => !uMap[id]);
    if (missingUids.length) {
      const { data: extraUsers } = await db
        .from("users")
        .select("*")
        .in("id", missingUids);
      (extraUsers as AppUser[] | null)?.forEach((u) => {
        uMap[String(u.id)] = u;
      });
    }

    setMentorsCatalog(
      mentorsList.map((m) => ({
        ...m,
        mu: {
          full_name: uMap[String(m.user_id)]?.full_name,
          username: uMap[String(m.user_id)]?.username,
        },
      })),
    );

    setUsers(uMap);
    setProfits((pR.data as ProfitRow[]) || []);
    setIdeas((iR.data as IdeaRow[]) || []);
    setRefs((rR.data as ReferralUser[]) || []);
    setRefP((rpR.data as ReferralProfitRow[]) || []);
    setServices((sR.data as ServiceRow[]) || []);
    setResources((resR.data as ResourceRow[]) || []);

    const mIds = (umR.data as { mentor_id: string | number }[] | null)?.map(
      (r) => r.mentor_id,
    );
    if (mIds?.length) {
      const { data: mData } = await db
        .from("mentors")
        .select("id,service_name,percent,user_id")
        .in("id", mIds)
        .eq("is_active", true);
      if (mData?.length) {
        const muIds = mData.map((m: { user_id: string | number }) => m.user_id);
        const { data: muData } = await db
          .from("users")
          .select("id,full_name,username")
          .in("id", muIds);
        const muMap: Record<
          string,
          { full_name?: string | null; username?: string | null }
        > = {};
        (muData as { id: string | number; full_name?: string; username?: string }[] | null)?.forEach(
          (u) => {
            muMap[String(u.id)] = u;
          },
        );
        setMyMentors(
          mData.map((m: MentorRow) => ({
            ...m,
            mu: muMap[String(m.user_id)] || {},
          })),
        );
      } else setMyMentors([]);
    } else setMyMentors([]);

    setReady(true);
  }, [uid]);

  useEffect(() => {
    initTelegramChrome();
    const t = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const likeIdea = useCallback(
    async (id: string | number) => {
      const db = getSupabase();
      if (!db) return;
      const uidStr = String(uid);
      setIdeas((prev) =>
        prev.map((idea) => {
          if (String(idea.id) !== String(id)) return idea;
          const liked = idea.liked_by?.includes(uidStr);
          const liked_by = [...(idea.liked_by || [])];
          let votes = idea.votes_count ?? 0;
          if (liked) {
            votes = Math.max(0, votes - 1);
            const i = liked_by.indexOf(uidStr);
            if (i >= 0) liked_by.splice(i, 1);
          } else {
            votes += 1;
            liked_by.push(uidStr);
          }
          return { ...idea, votes_count: votes, liked_by };
        }),
      );
      await db.rpc("toggle_vote", { row_id: id, user_tg_id: uidStr });
    },
    [uid],
  );

  const votePoll = useCallback(async (ideaId: string | number, oi: number) => {
    const db = getSupabase();
    if (!db) return;
    const uidStr = String(uid);
    let contentOut = "";
    setIdeas((prev) => {
      const idea = prev.find((i) => String(i.id) === String(ideaId));
      if (!idea?.content) return prev;
      let p: {
        question: string;
        options: string[];
        votes: number[];
        voters: string[][];
      };
      try {
        p = JSON.parse(idea.content) as typeof p;
      } catch {
        return prev;
      }
      const pv = p.voters.findIndex((v) => v.includes(uidStr));
      if (pv !== -1) {
        p.votes[pv] = Math.max(0, p.votes[pv] - 1);
        p.voters[pv] = p.voters[pv].filter((x) => x !== uidStr);
      }
      if (pv !== oi) {
        p.votes[oi] = (p.votes[oi] || 0) + 1;
        p.voters[oi] = p.voters[oi] || [];
        p.voters[oi].push(uidStr);
      }
      contentOut = JSON.stringify(p);
      return prev.map((i) =>
        String(i.id) === String(ideaId) ? { ...i, content: contentOut } : i,
      );
    });
    if (contentOut)
      await db.from("ideas").update({ content: contentOut }).eq("id", ideaId);
  }, [uid]);

  const submitIdea = useCallback(
    async (payload: { category: string; content: string }) => {
      const db = getSupabase();
      if (!db) return null;
      const ni = {
        user_id: String(uid),
        user_name: uname,
        category: payload.category,
        content: payload.content,
        votes_count: 0,
        liked_by: [] as string[],
      };
      const { data } = await db.from("ideas").insert(ni).select();
      const row = data?.[0] as IdeaRow | undefined;
      if (row) setIdeas((prev) => [row, ...prev]);
      return row ?? null;
    },
    [uid, uname],
  );

  const value = useMemo(
    () => ({
      ready,
      dbOk,
      uid,
      uname,
      uphoto,
      users,
      profits,
      ideas,
      refs,
      refP,
      services,
      resources,
      myMentors,
      mentorsCatalog,
      me,
      refresh: load,
      setIdeas,
      likeIdea,
      votePoll,
      submitIdea,
    }),
    [
      ready,
      dbOk,
      uid,
      uname,
      uphoto,
      users,
      profits,
      ideas,
      refs,
      refP,
      services,
      resources,
      myMentors,
      mentorsCatalog,
      me,
      load,
      likeIdea,
      votePoll,
      submitIdea,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx)
    throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
