# 💪 Calisthenics Tracker

Aplikacja webowa (React + Vite + TypeScript) do śledzenia postępów w
kalistenice: profile użytkowników, podstawowe ćwiczenia (pull up, dip,
chin up, dead hang, row i inne) oraz maksymalnie 3 aktywnie trenowane
skille (muscle up, front/back lever, planche, handstand, dragon flag itd.).

Projekt jest w 100% statyczny — gotowy do hostowania na **GitHub Pages**.

## Spis treści

- [Funkcje](#funkcje)
- [Przechowywanie danych](#przechowywanie-danych)
- [Uruchomienie lokalne](#uruchomienie-lokalne)
- [Wdrożenie na GitHub Pages](#wdrożenie-na-github-pages)
- [Współdzielenie profili między urządzeniami (Supabase)](#współdzielenie-profili-między-urządzeniami-supabase)
- [Struktura projektu](#struktura-projektu)

## Funkcje

- **Lista profili** — strona główna z kartami wszystkich zapisanych profili
  (zdjęcie, nazwa, status). Kliknięcie karty otwiera widok profilu.
- **Widok profilu** z dwoma zakładkami:
  - **Basic** — pull up, dip, chin up, dead hang, row (+ możliwość dodania
    kolejnych, bardziej zaawansowanych wariantów, np. L-sit pull up,
    dynamic pull up, archer pull up, weighted dip...). Dla każdego
    ćwiczenia wybierasz sposób pomiaru: **na czas**, **na powtórzenia**
    lub **powtórzenia w seriach**.
  - **Skille** — maks. **3 aktywnie trenowane** skille naraz (muscle up,
    l-sit, back lever, front lever, planche, handstand, dragon flag,
    human flag...), każdy z polem tekstowym na opis aktualnej wariacji
    (np. „back lever straddle”, „muscle up z gumą 10–15 kg”).
- **Edycja profilu** — zmiana zdjęcia, nazwy i statusu (dostępna tylko dla
  właściciela profilu na danym urządzeniu).
- Pełna responsywność (mobile + desktop).

## Przechowywanie danych

GitHub Pages hostuje wyłącznie pliki statyczne — nie ma tam backendu ani
bazy danych. Dlatego dane w tej aplikacji są przechowywane **po stronie
klienta**:

- **Domyślnie: `localStorage`.** Po sklonowaniu repo i uruchomieniu
  aplikacji "out of the box" wszystko działa lokalnie — profile są
  zapisywane w przeglądarce użytkownika. To wystarcza do przetestowania
  aplikacji i do użytku jednoosobowego na jednym urządzeniu, ale **profile
  nie są widoczne na innych urządzeniach ani w innych przeglądarkach**.
- **Opcjonalnie: Supabase (współdzielone profile).** Jeśli chcesz, aby
  różni użytkownicy na różnych urządzeniach widzieli te same profile (np.
  żeby znajomi mogli oglądać nawzajem swoje postępy), musisz podłączyć
  darmową bazę danych Supabase — patrz sekcja
  [Współdzielenie profili między urządzeniami](#współdzielenie-profili-między-urządzeniami-supabase)
  poniżej. **To jest wymagany krok konfiguracyjny, jeśli zależy Ci na
  współdzieleniu danych — bez niego aplikacja działa wyłącznie lokalnie.**

Aplikacja sama wykrywa, czy Supabase jest skonfigurowany (zmienne
środowiskowe `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`). Jeśli nie —
działa w trybie czysto lokalnym i pokazuje o tym baner w interfejsie.

### Kto może edytować profil?

Ponieważ nie ma prawdziwego systemu logowania, aplikacja pamięta lokalnie
(w `localStorage` danej przeglądarki) identyfikator "Twojego" profilu —
czyli tego, który stworzyłeś/-aś na tym urządzeniu. Tylko ten profil można
edytować z tej przeglądarki; profile innych osób (nawet jeśli są
współdzielone przez Supabase) wyświetlają się w trybie tylko do odczytu.

## Uruchomienie lokalne

Wymagania: [Node.js](https://nodejs.org/) w wersji 18+ oraz npm.

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/TWOJ_LOGIN/calisthenics-tracker.git
cd calisthenics-tracker

# 2. Zainstaluj zależności
npm install

# 3. (Opcjonalnie) skonfiguruj współdzielenie przez Supabase
cp .env.example .env.local
# uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY — patrz sekcja niżej

# 4. Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:5173`.

Build produkcyjny (do folderu `dist/`):

```bash
npm run build
npm run preview   # podgląd builda lokalnie
```

## Wdrożenie na GitHub Pages

1. **Zmień `base` w `vite.config.ts`** tak, aby pasował do nazwy Twojego
   repozytorium:

   ```ts
   export default defineConfig({
     plugins: [react()],
     base: '/nazwa-twojego-repo/', // np. '/calisthenics-tracker/'
   })
   ```

   Jeśli repo nazywa się `TWOJ_LOGIN.github.io` (repo główne konta), ustaw
   `base: '/'`.

2. **Wypchnij kod na branch `main` na GitHub.**

3. **Włącz GitHub Pages przez GitHub Actions:**
   - Wejdź w ustawienia repo → `Settings` → `Pages`.
   - W sekcji `Build and deployment` → `Source` wybierz **GitHub Actions**.

4. **(Opcjonalnie) Dodaj sekrety Supabase**, jeśli chcesz współdzielone
   profile również na wersji produkcyjnej: `Settings` → `Secrets and
   variables` → `Actions` → dodaj `VITE_SUPABASE_URL` i
   `VITE_SUPABASE_ANON_KEY`. Workflow (`.github/workflows/deploy.yml`) już
   jest skonfigurowany, aby je odczytać podczas builda.

5. Każdy `push` na `main` automatycznie zbuduje i wdroży aplikację
   (workflow `deploy.yml`). Adres aplikacji pojawi się w zakładce
   `Settings → Pages` oraz w podsumowaniu uruchomienia workflow w zakładce
   `Actions`.

Routing w aplikacji korzysta z `HashRouter` (adresy w stylu
`.../#/profile/xyz`), dzięki czemu odświeżenie strony na GitHub Pages
zawsze działa poprawnie (bez dodatkowej konfiguracji przekierowań 404).

## Współdzielenie profili między urządzeniami (Supabase)

Domyślnie każdy profil jest widoczny tylko w przeglądarce, w której został
stworzony. Aby profile były **wspólne dla wszystkich odwiedzających**
(czyli żeby np. dwie osoby na dwóch różnych telefonach widziały te same
profile), potrzebna jest zewnętrzna baza danych — używamy do tego
darmowego serwisu [Supabase](https://supabase.com/).

### Krok po kroku

1. Załóż darmowe konto na [supabase.com](https://supabase.com/) i stwórz
   nowy projekt (Free tier w zupełności wystarczy).

2. W panelu projektu wejdź w **SQL Editor** i uruchom poniższy skrypt,
   żeby stworzyć tabelę na profile:

   ```sql
   create table profiles (
     id text primary key,
     data jsonb not null,
     updated_at timestamptz default now()
   );

   alter table profiles enable row level security;

   -- Uwaga: te polityki są celowo w pełni otwarte (bez logowania),
   -- żeby projekt demonstracyjny działał "out of the box" na darmowym
   -- planie. Każdy, kto zna publiczny (anon) klucz API, może odczytywać
   -- i zapisywać dane w tej tabeli. NIE wrzucaj tu danych wrażliwych.
   -- Do prawdziwej produkcji dodaj Supabase Auth i zawęź polityki do
   -- właściciela rekordu.
   create policy "public read" on profiles for select using (true);
   create policy "public write" on profiles for insert with check (true);
   create policy "public update" on profiles for update using (true);
   create policy "public delete" on profiles for delete using (true);
   ```

3. W panelu projektu wejdź w **Project Settings → API** i skopiuj:
   - `Project URL` → wklej jako `VITE_SUPABASE_URL`
   - `anon public` key → wklej jako `VITE_SUPABASE_ANON_KEY`

4. Lokalnie: skopiuj `.env.example` do `.env.local` i uzupełnij obie
   wartości:

   ```bash
   cp .env.example .env.local
   ```

   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

5. Uruchom ponownie `npm run dev` — baner "dane tylko lokalnie" powinien
   zniknąć, a nowo tworzone/edytowane profile będą synchronizowane z
   Supabase i widoczne na innych urządzeniach/przeglądarkach.

6. Na GitHub Pages: dodaj te same dwie wartości jako **sekrety** repo
   (`Settings → Secrets and variables → Actions`), tak aby workflow builda
   mógł je wstrzyknąć podczas `npm run build` (patrz krok 4 w sekcji
   [Wdrożenie na GitHub Pages](#wdrożenie-na-github-pages)).

### Jak to działa w kodzie

- `src/storage/supabaseClient.ts` — inicjalizuje klienta Supabase tylko
  jeśli zmienne środowiskowe są ustawione (`isSupabaseConfigured`).
- `src/storage/profileStore.ts` — jedna warstwa dostępu do danych:
  zawsze pisze/czyta z `localStorage` (cache offline), a dodatkowo, jeśli
  Supabase jest skonfigurowany, synchronizuje te same dane w chmurze
  (merge po polu `updatedAt`, żeby uniknąć nadpisywania nowszych zmian).

Bez konfiguracji Supabase aplikacja nie traci żadnej funkcjonalności — po
prostu każde urządzenie/przeglądarka ma swój własny, niezależny zestaw
profili.

## Struktura projektu

```
calisthenics-tracker/
├── .github/workflows/deploy.yml   # CI/CD do GitHub Pages
├── src/
│   ├── components/
│   │   ├── ProfileCard.tsx        # karta profilu na liście
│   │   ├── ExerciseItem.tsx       # wiersz ćwiczenia (Basic)
│   │   ├── SkillItem.tsx          # wiersz skilla (+ pole wariacji)
│   │   ├── MeasurementEditor.tsx  # edytor typu pomiaru (czas/powt./serie)
│   │   ├── AddExerciseModal.tsx   # modal wyboru z katalogu (ćwiczenia/skille)
│   │   └── EditProfileModal.tsx   # modal tworzenia/edycji profilu
│   ├── pages/
│   │   ├── ProfileListPage.tsx    # strona główna — lista profili
│   │   └── ProfileViewPage.tsx    # widok pojedynczego profilu
│   ├── data/
│   │   ├── catalog.ts             # katalog ćwiczeń Basic i Skille
│   │   └── defaults.ts            # domyślne wartości dla nowego profilu
│   ├── hooks/
│   │   └── useProfiles.ts         # logika CRUD na profilach
│   ├── storage/
│   │   ├── profileStore.ts        # localStorage + opcjonalny Supabase
│   │   └── supabaseClient.ts      # inicjalizacja klienta Supabase
│   ├── types/index.ts             # typy TypeScript (Profile, Exercise...)
│   ├── App.tsx                    # routing (HashRouter)
│   └── main.tsx                   # punkt wejścia
├── vite.config.ts                 # konfiguracja Vite (base path GH Pages)
└── .env.example                   # szablon zmiennych środowiskowych
```

## Licencja

Projekt demonstracyjny — używaj i modyfikuj dowolnie.
