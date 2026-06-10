<script>

  export let data;
  export let form;

  let showNewProjectModal = false;
  let newProjectName = '';

</script>


<main>
{#if !data.user}
    <p>You have not logged in</p>
{:else}
    <section class="dashboard">
    <div class="dashboard-header">
        <div>
        <h1>Good to see you, <span class="accent">{data.user.username}</span></h1>
        <p class="subtitle">
            {`You have ${data.projects.length} project${data.projects.length === 1 ? '' : 's'}.`}
        </p>
        </div>
        <button class="btn-primary" onclick={() => showNewProjectModal = true}>
        <span class="plus">+</span> New project
        </button>
    </div>

    {#if data.projects.length > 0}
        {#each data.projects as project}
            <a href="/{project.id}">
            <div>
                <h2 class="card-title">{project.name}</h2>
                <p>{project.role}</p>
            </div>
            </a>
        {/each}
    {/if}
    </section>
{/if}
</main>

{#if showNewProjectModal}
    <form method="POST">
        <input type="text" name="name" placeholder="e.g. Research paper, Novel draft…" required/>
        {#if form?.error}
            <p class="modal-error">{form.error}</p>
        {/if}
        <button type="submit">Create project</button>
    </form>
{/if}

<style>
  
</style>