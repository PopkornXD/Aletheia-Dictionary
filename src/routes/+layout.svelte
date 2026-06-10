<script>
	import favicon from '$lib/assets/favicon.svg';

	export let data;
</script>


<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Aletheia Dictionary</title>
</svelte:head>


<header>
	<a href="/"><h1>Aletheia Dictionary</h1></a>

	{#if data.user == null}
		<button onclick={() => {window.location.href = "/login";}}>Login</button>
	{:else}
		<div>
			<a href="/profile"><h2>{data.user.username}</h2></a>
			<form method="POST" action="/logout" style="display: inline;">
				<button type="submit">Logout</button>
			</form>
		</div>
	{/if}

</header>


<main>
	<slot />
</main>


<footer>
	<a href="/privacy_policy"><p>Privacy Policy</p></a>
	<a href="/terms_of_service"><p>Terms of Service</p></a>
</footer>



<style>

	:global(*) {
		transition: ease-in-out 0.2s;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
		min-height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr auto;
	}


	:global(a) {
		text-decoration: none;

	}

	header {
		width: 100% - 40px;
		height: 80px;
		background-color: black;
		position: sticky;
		top: 0;
		padding: 0px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px;
		z-index: 9999;
	}

	footer {
		width: 100vw;
		height: 80px;
		background-color: black;
		display: flex;
		align-items: center;
		gap: 40px;
		justify-content: center;
	}

	main {
		margin: 20px;
	}

	h1, h2, p {
		margin: 0;
		color: white;
	}

	button {
		width: 100px;
		height: 40px;
		margin-right: 40px;
	}

	:global(a:hover) {
		transform: scale(1.1);
	}

	div {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
	}



</style>