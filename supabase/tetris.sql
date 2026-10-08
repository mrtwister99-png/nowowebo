-- ============================================================================
-- miniGAME Tetris: společné počítadlo pokusů a žebříček HIGHSCORE
-- Spustit jednou v Supabase: SQL Editor -> New query -> vložit -> Run.
-- Bezpečnost: tabulky mají zapnuté RLS a žádnou policy, takže přes veřejný klíč
-- (anon) nejdou číst ani měnit přímo. Web smí jen volat čtyři funkce tetris_* níže.
-- ============================================================================

-- 1) Tabulky ------------------------------------------------------------------
create table if not exists public.tetris_scores (
  id         bigint generated always as identity primary key,
  initials   text        not null check (initials ~ '^[A-Z0-9]{3}$'),
  score      integer     not null check (score between 1 and 150000),
  created_at timestamptz not null default now()
);

create index if not exists tetris_scores_rank_idx
  on public.tetris_scores (score desc, created_at asc);

-- Počítadlo: vždy jediný řádek (id = 1)
create table if not exists public.tetris_stats (
  id    smallint primary key default 1 check (id = 1),
  tries bigint   not null default 0
);

insert into public.tetris_stats (id, tries) values (1, 0) on conflict (id) do nothing;

-- 2) Zámek tabulek -------------------------------------------------------------
alter table public.tetris_scores enable row level security;
alter table public.tetris_stats  enable row level security;

revoke all on table public.tetris_scores from anon, authenticated;
revoke all on table public.tetris_stats  from anon, authenticated;

-- 3) Funkce, které smí volat web -------------------------------------------------

-- Kolik lidí zkoušelo Tetris
create or replace function public.tetris_get_tries()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select tries from public.tetris_stats where id = 1;
$$;

-- Kliknutí na HRÁT: +1, vrátí nový společný součet
create or replace function public.tetris_add_try()
returns bigint
language sql
volatile
security definer
set search_path = public
as $$
  update public.tetris_stats set tries = tries + 1 where id = 1 returning tries;
$$;

-- Nejlepší výsledky (výchozí 8 míst, nejvýš 20)
create or replace function public.tetris_top_scores(max_rows integer default 8)
returns table (initials text, score integer, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select s.initials, s.score, s.created_at
  from public.tetris_scores s
  order by s.score desc, s.created_at asc
  limit least(greatest(coalesce(max_rows, 8), 1), 20);
$$;

-- Uložení výsledku: kontrola přezdívky (3 znaky A-Z, 0-9), rozumného skóre a ochrana proti zahlcení
create or replace function public.tetris_submit_score(p_initials text, p_score integer)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_initials text := upper(btrim(coalesce(p_initials, '')));
begin
  if v_initials !~ '^[A-Z0-9]{3}$' then
    raise exception 'neplatná přezdívka' using errcode = '22023';
  end if;

  if p_score is null or p_score < 1 or p_score > 150000 then
    raise exception 'neplatné skóre' using errcode = '22023';
  end if;

  -- Ochrana proti zahlcení: nejvýš 60 uložených výsledků za minutu pro celý web
  if (select count(*) from public.tetris_scores where created_at > now() - interval '1 minute') >= 60 then
    raise exception 'příliš mnoho výsledků, zkus to za chvíli' using errcode = '54000';
  end if;

  insert into public.tetris_scores (initials, score) values (v_initials, p_score);
end;
$$;

-- 4) Oprávnění: jen tyto čtyři funkce -------------------------------------------
revoke all on function public.tetris_get_tries()                      from public;
revoke all on function public.tetris_add_try()                        from public;
revoke all on function public.tetris_top_scores(integer)              from public;
revoke all on function public.tetris_submit_score(text, integer)      from public;

grant execute on function public.tetris_get_tries()                   to anon, authenticated;
grant execute on function public.tetris_add_try()                     to anon, authenticated;
grant execute on function public.tetris_top_scores(integer)           to anon, authenticated;
grant execute on function public.tetris_submit_score(text, integer)   to anon, authenticated;
