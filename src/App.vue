<template>
  <div id="app">
    <header class="app-header">
      <div>
        <p class="app-eyebrow">Campagne de vaccination</p>
        <h1>Suivi des patients</h1>
      </div>
      <nav>
        <router-link to="/patients">Patients</router-link>
        <router-link to="/patients/new">Ajouter</router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  background: #f6f7fb;
  color: #1f2933;
}

.app-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 24px clamp(16px, 6vw, 64px) 16px;
  gap: 16px;
}

.app-eyebrow {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.08em;
  margin: 0;
  color: #667084;
}

h1 {
  margin: 8px 0 0;
  font-size: clamp(24px, 4vw, 34px);
}

nav {
  display: flex;
  gap: 12px;
}

nav a {
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 600;
  color: #1f2933;
  border: 1px solid #d7dce5;
}

nav a.router-link-exact-active {
  color: #fff;
  background: #2563eb;
  border-color: #2563eb;
}

.app-main {
  padding: 0 clamp(16px, 6vw, 64px) 48px;
}
</style>
