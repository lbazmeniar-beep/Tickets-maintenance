<script setup>
// Liste des tickets : chargement, erreur, recherche et filtres
import { ref, computed, onMounted } from 'vue'
import { getTickets } from '../services/ticketService.js'

// ---------- État (ref) ----------
const tickets = ref([])
const chargement = ref(false)
const erreur = ref('')

const recherche = ref('')       // texte tapé dans la recherche par titre
const filtreStatut = ref('')    // '' = tous
const filtrePriorite = ref('')  // '' = toutes

const statuts = ['Ouvert', 'En cours', 'Résolu']
const priorites = ['Haute', 'Moyenne', 'Basse']

// ---------- Chargement des données ----------
async function chargerTickets() {
  chargement.value = true
  erreur.value = ''
  try {
    tickets.value = await getTickets()
  } catch (e) {
    tickets.value = []
    if (e.response) {
      // Le serveur a répondu avec un code d'erreur (404, 500...)
      erreur.value = `Erreur du serveur (code ${e.response.status}). Réessayez plus tard.`
    } else {
      // Aucune réponse : serveur arrêté ou injoignable
      erreur.value =
        "Impossible de joindre l'API. Vérifiez que JSON Server est démarré (npm run api, port 3000)."
    }
  } finally {
    chargement.value = false
  }
}

onMounted(chargerTickets)

// ---------- Recherche et filtres (computed) ----------
// Met en minuscules et retire les accents pour une recherche tolérante (« ecran » trouve « Écran »)
function normaliser(texte) {
  return texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const ticketsFiltres = computed(() => {
  const mot = normaliser(recherche.value.trim())
  return tickets.value.filter((t) => {
    const okTitre = !mot || normaliser(t.titre).includes(mot)
    const okStatut = !filtreStatut.value || t.statut === filtreStatut.value
    const okPriorite = !filtrePriorite.value || t.priorite === filtrePriorite.value
    return okTitre && okStatut && okPriorite
  })
})

const filtreActif = computed(
  () => recherche.value.trim() !== '' || filtreStatut.value !== '' || filtrePriorite.value !== ''
)

function reinitialiserFiltres() {
  recherche.value = ''
  filtreStatut.value = ''
  filtrePriorite.value = ''
}

// ---------- Affichage ----------
// Classe CSS d'un badge à partir de sa valeur : « En cours » -> « en-cours »
function classeBadge(valeur) {
  return normaliser(valeur).replace(/\s+/g, '-')
}

function formaterDate(dateIso) {
  const [annee, mois, jour] = dateIso.split('-')
  return `${jour}/${mois}/${annee}`
}
</script>

<template>
  <section aria-label="Liste des tickets">
    <!-- Recherche et filtres -->
    <div class="outils">
      <div class="champ champ-large">
        <label for="recherche">Rechercher par titre</label>
        <input id="recherche" v-model="recherche" type="search" placeholder="Ex. imprimante" />
      </div>
      <div class="champ">
        <label for="statut">Statut</label>
        <select id="statut" v-model="filtreStatut">
          <option value="">Tous</option>
          <option v-for="s in statuts" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="champ">
        <label for="priorite">Priorité</label>
        <select id="priorite" v-model="filtrePriorite">
          <option value="">Toutes</option>
          <option v-for="p in priorites" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <button v-if="filtreActif" type="button" class="reinit" @click="reinitialiserFiltres">
        Réinitialiser
      </button>
    </div>

    <!-- Chargement -->
    <p v-if="chargement" class="etat" role="status">Chargement…</p>

    <!-- Erreur -->
    <div v-else-if="erreur" class="erreur" role="alert">
      <p>{{ erreur }}</p>
      <button type="button" @click="chargerTickets">Réessayer</button>
    </div>

    <!-- Résultats -->
    <template v-else>
      <p class="compteur" role="status" aria-live="polite">
        {{ ticketsFiltres.length }} ticket{{ ticketsFiltres.length > 1 ? 's' : '' }} affiché{{
          ticketsFiltres.length > 1 ? 's' : ''
        }}
        sur {{ tickets.length }}
      </p>

      <p v-if="ticketsFiltres.length === 0" class="etat">
        Aucun ticket ne correspond à votre recherche.
      </p>

      <ul v-else class="liste">
        <li v-for="t in ticketsFiltres" :key="t.id" class="ticket">
          <div class="haut">
            <h2>{{ t.titre }}</h2>
            <div class="badges">
              <span class="badge" :class="'priorite-' + classeBadge(t.priorite)">
                Priorité : {{ t.priorite }}
              </span>
              <span class="badge" :class="'statut-' + classeBadge(t.statut)">
                Statut : {{ t.statut }}
              </span>
            </div>
          </div>
          <p class="description">{{ t.description }}</p>
          <p class="meta">
            Demandeur : <strong>{{ t.demandeur }}</strong> · Créé le {{ formaterDate(t.dateCreation) }}
          </p>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.outils {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  background: #fff;
  border: 1px solid var(--bord);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;
}
.champ { display: flex; flex-direction: column; gap: 4px; min-width: 130px; }
.champ-large { flex: 1; min-width: 200px; }
label { font-size: 12px; font-weight: 700; color: var(--gris); }
input,
select {
  padding: 9px 10px;
  border: 1px solid #b8c3dc;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  background: #fff;
}
input:focus,
select:focus { outline: 2px solid #9db8ee; border-color: var(--bleu); }

.reinit,
.erreur button {
  padding: 9px 14px;
  border: none;
  border-radius: 8px;
  background: #e4e9f6;
  color: var(--bleu);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.etat { text-align: center; color: var(--gris); padding: 24px 0; }
.compteur { color: var(--gris); font-size: 14px; margin: 0 0 10px; }

.erreur {
  background: #fdecea;
  color: #8f2217;
  border: 1px solid #f3b9b2;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}
.erreur p { margin: 0 0 10px; font-weight: 600; }

.liste { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.ticket {
  background: #fff;
  border: 1px solid var(--bord);
  border-radius: 12px;
  padding: 14px 16px;
}
.haut { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; }
h2 { margin: 0; font-size: 18px; }
.description { margin: 8px 0; }
.meta { margin: 0; color: var(--gris); font-size: 13px; }

/* Badges : texte explicite + couleurs contrastées (la couleur n'est jamais le seul indicateur) */
.badges { display: flex; flex-wrap: wrap; gap: 6px; }
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid transparent;
}
.priorite-haute  { background: #fde2df; color: #8f1d12; border-color: #f0a79f; }
.priorite-moyenne { background: #fff0cf; color: #7a4a00; border-color: #ecc66f; }
.priorite-basse  { background: #e1f3e6; color: #17602f; border-color: #9ed2ae; }
.statut-ouvert   { background: #e2ebfb; color: #173f86; border-color: #a9c0ee; }
.statut-en-cours { background: #efe5fb; color: #55268c; border-color: #cbb0ec; }
.statut-resolu   { background: #e1f3e6; color: #17602f; border-color: #9ed2ae; }
</style>
