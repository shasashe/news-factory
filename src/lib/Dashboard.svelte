<!-- src/lib/Dashboard.svelte -->
<script>
    let menuOpen = false;
    
    function toggleMenu() {
      menuOpen = !menuOpen;
    }
  </script>
  
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-60 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md lg:static z-30">
      <div class="flex items-center justify-center h-16 bg-gray-100 dark:bg-gray-700">
        <h1 class="text-xl font-bold">Dashboard</h1>
      </div>
      <nav class="mt-4">
        <a class="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" href="/publish">Publish</a>
        <a class="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" href="/feeds">Feeds</a>
        <a class="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" href="/profiles">Profile</a>
        <a class="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" href="/settings">Settings</a>
      </nav>
    </div>
  
    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden ml-60">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 p-4 shadow-md">
        <div class="flex items-center justify-between">
          <button class="lg:hidden text-gray-500 dark:text-gray-400 focus:outline-none" on:click={toggleMenu}>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <h1 class="text-xl font-bold text-gray-700 dark:text-gray-100">Welcome</h1>
        </div>
      </header>
  
      <!-- Main content area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-900 p-6">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Your main content here -->
          </div>
        </div>
      </main>
    </div>
  </div>