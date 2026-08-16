-- Table des dossiers CEC
create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index pour recherche rapide par user
create index if not exists cases_user_id_idx on cases (user_id);

-- RLS (Row Level Security)
alter table cases enable row level security;

-- Politique : chaque user ne voit que ses propres cas
create policy "Users can view own cases"
  on cases for select
  using (auth.uid() = user_id);

create policy "Users can insert own cases"
  on cases for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cases"
  on cases for update
  using (auth.uid() = user_id);

create policy "Users can delete own cases"
  on cases for delete
  using (auth.uid() = user_id);

-- Trigger pour updated_at automatique
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cases_updated_at
  before update on cases
  for each row
  execute function update_updated_at();