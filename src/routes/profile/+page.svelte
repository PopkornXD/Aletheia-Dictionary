<script>
	export let data;
</script>

<div class="profile-container">
	{#if data.user}
		<div class="profile-card">
			<h1>Profile</h1>
			<div class="profile-info">
				<p><strong>Username:</strong> {data.user.username}</p>
				<p><strong>Email:</strong> {data.user.email}</p>
			</div>
		</div>
	{:else}
		<p>Please log in to view your profile.</p>
	{/if}
</div>


<style>
	.profile-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 70vh;
	}

	.profile-card {
		width: 100%;
		max-width: 400px;
		padding: 40px;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		text-align: center;
		margin-bottom: 30px;
		color: #333;
	}

	.profile-info {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	p {
		margin: 0;
		color: #333;
	}

	strong {
		color: #007bff;
	}
</style>
