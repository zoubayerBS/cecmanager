# CEC Manager

Application PWA de dossier médical informatisé pour les perfusionnistes en circulation extracorporelle (CEC).

## Fonctionnalités

### Workflow par étapes

| Étape | Description |
|-------|-------------|
| 1. Patient | Identification, poids, taille, groupe sanguin, ASA |
| 2. Intervention | Type d'acte (CABG, valves...), équipe chirurgicale |
| 3. Matériel | Oxygénateur, circuit, canules, composition du prime |
| 4. Pré-CEC | Check-list de 10 items avec progression |
| 5. CEC | Paramètres temps réel, événements en timeline |
| 6. Bilan | Entrées/Sorties avec priming automatique |
| 7. Rapport | Résumé et sauvegarde |

### Calculatrices intégrées

- Transport O₂ (CaO₂, DO₂, VO₂, O₂ER)
- SCA (Mosteller, DuBois, Haycock, Boyd)
- Débits & Indexation
- Hémodilution (VC, Ht CEC, facteur dilution)
- RVS (Résistances vasculaires systémiques)
- Héparine / ACT / Protamine
- Gaz du sang (α-stat / pH-stat)
- Ultrafiltration
- Pédiatrie

### Dashboard

- Liste des dossiers avec pagination (5 par page)
- Recherche par nom de patient ou type d'acte
- Swipe tactile entre les pages
- Suppression avec confirmation

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React 19 | UI |
| TypeScript | Typage fort |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| Zustand | State management |
| Supabase | Auth + Base de données |
| Lucide React | Iconographie |
| vite-plugin-pwa | Service Worker + Manifest |

## Installation

```bash
# Cloner le repository
git clone https://github.com/zoubayerBS/cecmanager.git
cd cecmanager

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase
```

## Configuration Supabase

### 1. Créer un projet sur [supabase.com](https://supabase.com)

### 2. Exécuter le schéma SQL

```sql
-- Table des dossiers CEC
create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists cases_user_id_idx on cases (user_id);

alter table cases enable row level security;

create policy "Users can view own cases"
  on cases for select using (auth.uid() = user_id);
create policy "Users can insert own cases"
  on cases for insert with check (auth.uid() = user_id);
create policy "Users can update own cases"
  on cases for update using (auth.uid() = user_id);
create policy "Users can delete own cases"
  on cases for delete using (auth.uid() = user_id);

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
```

### 3. Désactiver la confirmation email

Authentication → Providers → Email → décocher **Confirm email**

### 4. Variables d'environnement

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Développement

```bash
# Serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

## Déploiement

L'application est une PWA installable. Pour le déploiement :

```bash
# Build
npm run build

# Le dossier dist/ est prêt à être déployé
# Sur Vercel, Netlify, ou tout hébergeur static
```

## Structure du projet

```
src/
├── components/
│   ├── Stepper.tsx          # Navigation par étapes
│   └── rapport/             # Formulaire de rapport
├── lib/
│   ├── supabase.ts          # Client Supabase + auth
│   └── cases.ts             # CRUD des dossiers
├── pages/
│   ├── AuthPage.tsx         # Login / Register
│   ├── DashboardPage.tsx    # Liste des dossiers
│   ├── Steps.tsx            # Toutes les étapes du workflow
│   └── ...
├── store/
│   └── useWorkflowStore.ts  # State global Zustand
├── App.tsx                  # Router principal
└── main.tsx                 # Entry point
```

## License

MIT
