<template>
  <header class="site-header">
    <div class="container">
      <NuxtLink to="/" class="site-title">Xanthochroid: The Etymos Chronicle</NuxtLink>
      <nav class="main-nav">
        <NuxtLink to="/songs" class="nav-link">Songs</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  padding: 1rem 2rem;
  background-color: #1f1f1f;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e0e0e0;
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #c0c0c0;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #b38d3e;
}
</style>
