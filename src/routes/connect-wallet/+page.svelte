<script lang="ts">
  /** @type {import('./$types').ActionData} */
  export let form: { success?: boolean; balance?: number; address?: string };

  if (typeof window !== 'undefined' && form?.success) {
    window.location.href = "/dashboard";
  }
</script>
<div
class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg   bg-white/30 ring-2 ring-gray-900/50 "
>
<form method="POST" action="?/login">
  <div class="">
    <div class="">
      <label
      class=""
      for="paymail"
 
      >
        Paymail
      </label>
      <input
        class=""
        id="paymail"
        type="text"
        placeholder="Enter Paymail"
        name="email"
      />

    </div>
    <div class="">
      <label
        class=""
        for="paymail"
      >
        Password
      </label>
      <input
        class=""
        id="password"
        type="password"
        placeholder="Enter Password"
        name="password"
      />
    </div>
    <button
    type="submit"
    class=""
    >
    <!-- <a href="/dashboard"> --> 
    LogIn</button>
  </div>
</form>
{#if form?.success}
  <!-- this message is ephemeral; it exists because the page was rendered in
     response to a form submission. it will vanish if the user reloads -->
  <p class="pt-2">Logged In. Your Balance is {form?.balance}</p>
  <p class= "pt-2">Your Address is {form?.address}</p>
{/if}
</div>

<div
class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg   bg-white/30 ring-2 ring-gray-900/50 "
>
<form method="POST" action="?/signup">
  <div class="">
    
    <div class="">
      <label
        class=""
        for="paymail"
      >
        Paymail
      </label>
      <input
        class=""
        id="paymail"
        type="text"
        placeholder="Enter Paymail"
        name="email"
      />

    </div>
    <div class="">
      <label
        class=""
        for="paymail"
      >
        Password
      </label>
      <input
        class=""
        id="password"
        type="password"
        placeholder="Enter Password"
        name="password"
      />
    </div>

    <button
      type="submit"
      class=""
    >
      Sign Up
    </button>
  </div>
</form>
{#if form?.success}
  <!-- this message is ephemeral; it exists because the page was rendered in
     response to a form submission. it will vanish if the user reloads -->
  <p class="pt-2">Sign Up Done </p>
{/if}
</div>







<!-- <h1 method = "GET" action = "?/pubkey" ></h1> -->