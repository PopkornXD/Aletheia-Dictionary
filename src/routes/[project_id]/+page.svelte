<script>
    import { enhance } from '$app/forms';
    import { browser } from '$app/environment';

    export let data;

    let slots = [null, null, null];

    if (browser) {
        slots = [
            sessionStorage.getItem('left_page_id'),
            sessionStorage.getItem('middle_page_id'),
            sessionStorage.getItem('right_page_id'),
        ];
    }

    let show_form = false;
    let editing = {};
    let picking_sources_for = null;

    let link_panel = {};

    function saveSlots() {
        const keys = ['left_page_id', 'middle_page_id', 'right_page_id'];
        keys.forEach((k, i) => {
            if (slots[i] != null) sessionStorage.setItem(k, slots[i]);
            else sessionStorage.removeItem(k);
        });
    }

    function toggleEdit(page_id) {
        editing[page_id] = !editing[page_id];
        editing = editing;
        if (!editing[page_id] && picking_sources_for === page_id) {
            picking_sources_for = null;
        }
    }

    function sourcesFor(page_id) {
        return new Set(
            data.sources
                .filter(s => s.page_id == page_id)
                .map(s => s.source_id)
        );
    }

    function backlinksFor(page_id) {
        return new Set(
            data.sources
                .filter(s => s.source_id == page_id)
                .map(s => s.page_id)
        );
    }

    function openSourcePanel(slot_index) {
        const page_id = slots[slot_index];
        const target = slot_index + 1;

        if (target > 2) {
            shiftLeft(slot_index);
            const new_index = slots.indexOf(String(page_id));
            link_panel[new_index + 1] = { mode: 'sources', for_page_id: page_id };
        } else {
            link_panel[target] = { mode: 'sources', for_page_id: page_id };
        }
        link_panel = link_panel;
        slots = slots;
    }

    function openBacklinkPanel(slot_index) {
        const page_id = slots[slot_index];
        const target = slot_index - 1;

        if (target < 0) {
            shiftRight(slot_index);
            const new_index = slots.indexOf(String(page_id));
            link_panel[new_index - 1] = { mode: 'backlinks', for_page_id: page_id };
        } else {
            link_panel[target] = { mode: 'backlinks', for_page_id: page_id };
        }
        link_panel = link_panel;
        slots = slots;
    }

    function shiftLeft(slot_index) {
        for (let i = 0; i < slot_index; i++) {
            slots[i] = slots[i + 1];
            if (link_panel[i + 1]) {
                link_panel[i] = link_panel[i + 1];
                delete link_panel[i + 1];
            } else {
                delete link_panel[i];
            }
        }
        slots[slot_index] = null;
        delete link_panel[slot_index];
        saveSlots();
    }

    function shiftRight(slot_index) {
        for (let i = 2; i > slot_index; i--) {
            slots[i] = slots[i - 1];
            if (link_panel[i - 1]) {
                link_panel[i] = link_panel[i - 1];
                delete link_panel[i - 1];
            } else {
                delete link_panel[i];
            }
        }
        slots[slot_index] = null;
        delete link_panel[slot_index];
        saveSlots();
    }

    function openPageInSlot(slot_index, page_id) {
        slots[slot_index] = String(page_id);
        delete link_panel[slot_index];
        link_panel = link_panel;
        slots = slots;
        saveSlots();
    }

    async function addSource(target_page_id, source_page_id) {
        if (target_page_id === source_page_id) return;
        if (sourcesFor(target_page_id).has(source_page_id)) return;
        const fd = new FormData();
        fd.append('page_id', target_page_id);
        fd.append('source_id', source_page_id);
        const res = await fetch('?/addSource', { method: 'POST', body: fd });
        if (res.ok) {
            data.sources = [...data.sources, { page_id: target_page_id, source_id: source_page_id }];
        }
    }

    async function removeSource(target_page_id, source_page_id) {
        const fd = new FormData();
        fd.append('page_id', target_page_id);
        fd.append('source_id', source_page_id);
        const res = await fetch('?/removeSource', { method: 'POST', body: fd });
        if (res.ok) {
            data.sources = data.sources.filter(
                s => !(s.page_id == target_page_id && s.source_id == source_page_id)
            );
        }
    }
</script>

<div class="project_body">
    <div class="sidebar" class:picking={picking_sources_for !== null}>
        <button onclick={() => show_form = !show_form}>Create new page</button>
        {#if show_form}
            <form method="POST" action="?/newPage">
                <input type="text" name="name" placeholder="name">
                <button type="submit">Create page</button>
            </form>
        {/if}

        <br>

        <button onclick={() => {
            slots = [null, null, null];
            link_panel = {};
            ['left_page_id','middle_page_id','right_page_id'].forEach(k => sessionStorage.removeItem(k));
        }}>Close all pages</button>

        <br>

        <div class="pages_container">
            {#each data.pages as page}
                <button
                    class="sidebar_page_btn"
                    class:already_source={picking_sources_for !== null && sourcesFor(picking_sources_for).has(page.id)}
                    onclick={() => {
                        if (picking_sources_for !== null) {
                            if (sourcesFor(picking_sources_for).has(page.id)) {
                                removeSource(picking_sources_for, page.id);
                            } else {
                                addSource(picking_sources_for, page.id);
                            }
                        } else {
                            slots[0] = String(page.id);
                            slots[1] = null;
                            slots[2] = null;
                            link_panel = {};
                            saveSlots();
                        }
                    }}
                >{page.name}</button>
            {/each}
        </div>

        {#if picking_sources_for !== null}
            <button class="done_btn" onclick={() => picking_sources_for = null}>Done picking sources</button>
        {/if}
    </div>

   <div class="pages_div">
        {#each [0, 1, 2] as slot_index}
            {#if link_panel[slot_index]}
                {@const panel = link_panel[slot_index]}
                {@const origin = data.pages.find(p => p.id == panel.for_page_id)}
                {@const ids = panel.mode === 'sources'
                    ? [...sourcesFor(panel.for_page_id)]
                    : [...backlinksFor(panel.for_page_id)]}
                <div class="page link_panel">
                    <button class="close_panel_btn" onclick={() => {
                        delete link_panel[slot_index];
                        link_panel = link_panel;
                    }}>✕</button>
                    <h3 class="panel_title">
                        {panel.mode === 'sources' ? 'Sources of' : 'Pages linking to'}
                        <em>{origin?.name}</em>
                    </h3>
                    {#if ids.length === 0}
                        <p class="empty_msg">No {panel.mode === 'sources' ? 'sources' : 'backlinks'} found.</p>
                    {:else}
                        <div class="link_list">
                            {#each ids as pid}
                                {@const linked_page = data.pages.find(p => p.id == pid)}
                                {#if linked_page}
                                    <button
                                        class="link_item"
                                        onclick={() => openPageInSlot(slot_index, linked_page.id)}
                                    >{linked_page.name}</button>
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </div>
            {:else if slots[slot_index] != null && data.pages.find(p => p.id == slots[slot_index])}
                {@const page = data.pages.find(p => p.id == slots[slot_index])}
                <div class="page">
                    <button
                        class="nav_arrow left_arrow"
                        title="Pages that link to this page"
                        onclick={() => openBacklinkPanel(slot_index)}
                    >{`<`}</button>
                    <button
                        class="nav_arrow right_arrow"
                        title="Sources of this page"
                        onclick={() => openSourcePanel(slot_index)}
                    >{`>`}</button>

                    {#if editing[page.id]}
                        <form
                            method="POST"
                            action="?/editPage"
                            use:enhance={() => {
                                return ({ result, update }) => {
                                    if (result.type === 'success') {
                                        editing[page.id] = false;
                                        editing = editing;
                                        picking_sources_for = null;
                                    }
                                    update();
                                };
                            }}
                        >
                            <input type="hidden" name="page_id" value={page.id} />
                            <input class="edit_title" type="text" name="name" value={page.name} />
                            <textarea class="edit_body" name="text">{page.text}</textarea>
                            <div class="edit_actions">
                                <button type="submit">Save</button>
                                <button type="button" onclick={() => toggleEdit(page.id)}>Cancel</button>
                                <button
                                    type="button"
                                    class="source_btn"
                                    class:active={picking_sources_for === page.id}
                                    onclick={() => picking_sources_for = picking_sources_for === page.id ? null : page.id}
                                >
                                    {picking_sources_for === page.id ? 'Picking sources…' : 'Manage sources'}
                                </button>
                            </div>
                            {#if sourcesFor(page.id).size > 0}
                                <div class="sources_list">
                                    <strong>Sources:</strong>
                                    {#each [...sourcesFor(page.id)] as sid}
                                        {@const src = data.pages.find(p => p.id == sid)}
                                        {#if src}<span class="source_tag">{src.name}</span>{/if}
                                    {/each}
                                </div>
                            {/if}
                        </form>
                    {:else}
                        <button class="edit_btn" onclick={() => toggleEdit(page.id)}>Edit</button>
                        <h2>{page.name}</h2>
                        <p>{page.text}</p>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .project_body {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .sidebar {
        width: 15vw;
        display: flex;
        flex-direction: column;
        background-color: beige;
        padding: 10px;
        transition: background-color 0.2s;
        flex-shrink: 0;
    }

    .sidebar.picking {
        background-color: #d4e8ff;
    }

    .pages_container {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        background-color: burlywood;
        padding: 20px;
    }

    .already_source {
        opacity: 0.6;
        outline: 2px solid #9c7fc2;
        cursor: pointer;
    }

    .done_btn {
        margin-top: 10px;
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 6px 10px;
        cursor: pointer;
        border-radius: 4px;
    }

    .pages_div {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .page {
        background-color: beige;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .nav_arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.08);
        border: none;
        font-size: 1.8rem;
        line-height: 1;
        width: 28px;
        cursor: pointer;
        border-radius: 4px;
        padding: 4px 2px;
        color: #555;
        z-index: 1;
        transition: background 0.15s;
    }
    .nav_arrow:hover {
        background: rgba(0,0,0,0.18);
    }
    .left_arrow  { left: 4px; }
    .right_arrow { right: 4px; }

    .link_panel {
        background-color: #f0eafa;
        padding: 16px;
        overflow-y: auto;
    }

    .close_panel_btn {
        align-self: flex-end;
        background: none;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        color: #888;
        margin-bottom: 4px;
    }

    .panel_title {
        font-size: 1rem;
        text-align: center;
        margin-bottom: 12px;
        color: #444;
    }

    .empty_msg {
        color: #888;
        font-style: italic;
        text-align: center;
    }

    .link_list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    .link_item {
        background-color: #e0d0f8;
        border: none;
        border-radius: 6px;
        padding: 8px 12px;
        cursor: pointer;
        text-align: left;
        font-size: 0.95rem;
        transition: background 0.15s;
    }
    .link_item:hover {
        background-color: #c8b0ee;
    }

    .edit_btn {
        align-self: flex-start;
        margin: 8px;
    }

    .edit_title {
        font-size: 1.5rem;
        font-weight: bold;
        width: 90%;
        margin-top: 10px;
    }

    .edit_body {
        width: 90%;
        height: 60%;
        margin-top: 10px;
        font-size: 1rem;
        resize: vertical;
    }

    .edit_actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        flex-wrap: wrap;
    }

    .source_btn {
        background-color: #e8e0f0;
    }

    .source_btn.active {
        background-color: #9c7fc2;
        color: white;
    }

    .sources_list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
        width: 90%;
        align-items: center;
    }

    .source_tag {
        background-color: #d0c0e8;
        border-radius: 12px;
        padding: 2px 10px;
        font-size: 0.85rem;
    }

    p {
        white-space: pre-wrap;
    }
</style>