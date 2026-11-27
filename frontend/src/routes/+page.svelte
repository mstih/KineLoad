<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$app/env/public';

	let loading = $state(true);
	let message = $state('');
	let ok = $state(false);

	onMount(async () => {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/health`);
			const data = await res.json();
			message = data.message ?? 'No message';
			ok = res.ok;
		} catch {
			message = 'Cannot reach the API!';
			ok = false;
		} finally {
			loading = false;
		}
	});
</script>

<main class="p-8">
	<h1 class="text-2xl font-bold">KineLoad</h1>
	{#if loading}
		<p class="text-gray-500">Checking API...</p>
	{:else}
		<p class={ok ? 'text-green-600' : 'text-red-600'}>{message}</p>
	{/if}
</main>
