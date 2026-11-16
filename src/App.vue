<script setup>
import TicketList from './components/TicketList.vue'
</script>

<template>
  <div class="app">
    <header>
      <h1>Support informatique</h1>
      <p>Suivi des tickets de maintenance</p>
    </header>
    <main>
      <TicketList />
    </main>
  </div>
</template>

<style scoped>
.app { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
header { margin-bottom: 20px; }
h1 { margin: 0; color: var(--bleu); font-size: 26px; }
header p { margin: 4px 0 0; color: var(--gris); }
</style>
