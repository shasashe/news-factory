<script lang="ts">
  /** @type {import('./$types').ActionData} */
  export let form: { success?: boolean; balance?: number; address?: string };

  if (typeof window !== 'undefined' && form?.success) {
    window.location.href = "/dashboard";
  }
</script>

<!-- Login Form -->
<div class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg bg-white/30 ring-2 ring-gray-900/50">
  <form method="POST" action="?/login">
    <div>
      <label for="paymail">Paymail</label>
      <input id="paymail" type="text" placeholder="Enter Paymail" name="email" />
    </div>
    <div>
      <label for="password">Password</label>
      <input id="password" type="password" placeholder="Enter Password" name="password" />
    </div>
    <button type="submit">Log In</button>
  </form>
  {#if form?.success}
    <p class="pt-2">Logged In. Your Balance is {form?.balance}</p>
    <p class="pt-2">Your Address is {form?.address}</p>
  {/if}
</div>

<!-- Signup Form -->
<div class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg bg-white/30 ring-2 ring-gray-900/50">
  <form method="POST" action="?/signup">
    <div>
      <label for="paymail">Paymail</label>
      <input id="paymail" type="text" placeholder="Enter Paymail" name="email" />
    </div>
    <div>
      <label for="password">Password</label>
      <input id="password" type="password" placeholder="Enter Password" name="password" />
    </div>
    <button type="submit">Sign Up</button>
  </form>
  {#if form?.success}
    <p class="pt-2">Sign Up Done</p>
  {/if}
</div>
