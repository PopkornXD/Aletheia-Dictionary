<script>
	export let form;
</script>

<div class="container">
	<div class="signup-box">
		<h1>Sign Up</h1>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}

		<form method="POST">
			<div class="form-group">
				<label for="username">Username:</label>
				<input type="text" id="username" name="username" value={form?.username || ''} required />
			</div>

			<div class="form-group">
				<label for="email">Email:</label>
				<input type="email" id="email" name="email" value={form?.email || ''} required />
			</div>

			<div class="form-group">
				<label for="password">Password:</label>
				<input type="password" id="password" name="password" value={form?.password || ''} required />
			</div>

			<button type="submit">Sign Up</button>
		</form>

		<p class="login-link">
			Already have an account? <a href="/login">Log in</a>
		</p>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 70vh;
	}

	.signup-box {
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

	.error {
		background-color: #f8d7da;
		color: #721c24;
		padding: 12px;
		border-radius: 4px;
		margin-bottom: 20px;
		border: 1px solid #f5c6cb;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-weight: bold;
		color: #333;
	}

	input {
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 16px;
	}

	input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
	}

	input:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}

	button[type='submit'] {
		padding: 12px;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button[type='submit']:hover:not(:disabled) {
		background-color: #218838;
	}

	button[type='submit']:disabled {
		background-color: #6c757d;
		cursor: not-allowed;
	}

	.login-link {
		text-align: center;
		color: #666;
		margin-top: 20px;
	}

	.login-link a {
		color: #007bff;
		text-decoration: underline;
	}

	.login-link a:hover {
		color: #0056b3;
	}
</style>
