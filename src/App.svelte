<script>
  import { setContext } from "svelte";
  import {
    isReady,
    nodesDetails,
    edgesDetails,
    nodesScoreDomain,
    nodesAgeDomain,
    nodesDegreeInDomain,
    nodesDegreeOutDomain,
  } from "./data/dataApi.js";
  import {
    hoveredNodeId,
    selectedNodeId,
    minNodeScore,
    maxNodeScore,
    minNodeAge,
    maxNodeAge,
    minNodeDegreeIn,
    maxNodeDegreeIn,
    minNodeDegreeOut,
    maxNodeDegreeOut,
  } from "./state/uiState.js";
  import theme from "./config/theme";

  import Network from "./lib/vis/Network.svelte";
  import Loader from "./lib/ui/Loader.svelte";
  import Logo from "./lib/ui/Logo.svelte";
  import FilterView from "./views/FilterView.svelte";
  import TooltipView from "./views/TooltipView.svelte";
  import NodeDetailView from "./views/NodeDetailView.svelte";
  import { Toggle } from "flowbite-svelte";
  import { AdjustmentsHorizontalOutline } from "flowbite-svelte-icons";
  import { CloseCircleSolid } from "flowbite-svelte-icons";
  import { isMobile, snapshotId, snapshotsAvailable } from "./data/dataStore";
  import { toLocaleString } from "./utils/format";
  import { isMenuVisible } from "./state/uiState.js";

  let width, height;

  setContext("theme", theme);

  $: {
    if ($isReady) {
      // node score
      if ($minNodeScore === undefined) {
        $minNodeScore = $nodesScoreDomain[0];
      }
      if ($maxNodeScore === undefined) {
        $maxNodeScore = $nodesScoreDomain[1];
      }
      // node age
      if ($minNodeAge === undefined) {
        $minNodeAge = $nodesAgeDomain[0];
      }
      if ($maxNodeAge === undefined) {
        $maxNodeAge = $nodesAgeDomain[1];
      }

      // degree in
      if ($minNodeDegreeIn === undefined) {
        $minNodeDegreeIn = $nodesDegreeInDomain[0];
      }
      if ($maxNodeDegreeIn === undefined) {
        $maxNodeDegreeIn = $nodesDegreeInDomain[1];
      }
      // degree out
      if ($minNodeDegreeOut === undefined) {
        $minNodeDegreeOut = $nodesDegreeOutDomain[0];
      }
      if ($maxNodeDegreeOut === undefined) {
        $maxNodeDegreeOut = $nodesDegreeOutDomain[1];
      }
    }
  }
</script>

{#if $isReady}
  <main class="min-h-screen flex flex-col h-screen">
    <div class="header | p-4 bg-gray-800">
      <h1 class=" text-white font-serif flex flex-row" style="">
        <div class="flex flex-row">
          <div>
          <a href="https://karma3labs.com/" target="_blank">
            <Logo />
            
          </a>
        </div>
        <div style="margin-top:1px;" class="text-amber-300 items-center">
          &nbsp;Snaps Reputation Graph
        </div>
        </div>
        <div></div>

        {#if isMobile}
          <div style="margin-left: auto;">
            {#if $isMenuVisible}
              <CloseCircleSolid
                class="cursor-pointer text-amber-300"
                on:click={() => ($isMenuVisible = !$isMenuVisible)}
              />
            {/if}
            {#if !$isMenuVisible}
              <AdjustmentsHorizontalOutline
                class="cursor-pointer text-amber-300"
                on:click={() => ($isMenuVisible = !$isMenuVisible)}
              />
            {/if}
          </div>
        {/if}
      </h1>
    </div>
    <div class="flex flex-row flex-1 overflow-auto">
      <div class={(!isMobile ? "basis-9/12" : "w-full") + " h-full"}>
        <div class="stage" bind:clientWidth={width} bind:clientHeight={height}>
          <div class="stage__wrapper">
            <Network
              {width}
              {height}
              nodes={$nodesDetails}
              edges={$edgesDetails}
              on:node-mouseover={(d) => {
                if (isMobile && $hoveredNodeId && $hoveredNodeId === d.detail) {
                  $hoveredNodeId = "";
                  return;
                }

                $hoveredNodeId = d.detail;
              }}
              on:node-mouseout={(d) => {
                $hoveredNodeId = "";
              }}
              on:node-click={(d) => {
                if ($selectedNodeId !== "") {
                  if ($selectedNodeId === d.detail) {
                    $selectedNodeId = "";
                  } else {
                    $selectedNodeId = d.detail;
                  }
                } else {
                  $selectedNodeId = d.detail;
                }
              }}
            />
          </div>
        </div>
      </div>
      {#if !isMobile || $isMenuVisible}
        <div
          class={!isMobile
            ? "flex flex-col flex-1 overflow-auto | basis-3/12 h-full | border-l border-l-gray-800 bg-white"
            : "fixed flex flex-col flex-1 overflow-auto | w-full h-full | border-l border-l-gray-800 bg-white"}
        >
          {#if $selectedNodeId == ""}
            <FilterView />
          {:else}<NodeDetailView />{/if}
        </div>
      {/if}
    </div>

    {#if !isMobile}
      <div class="fixed bottom-0 right-0 m-4">
        <!-- Your content here -->
        <p class="bg-white p-2 rounded-lg" style="opacity: 0.5;">
          Epoch {toLocaleString($snapshotsAvailable.find(a => a.id === snapshotId).effectiveDateMs)}
        </p>
      </div>
    {/if}
  </main>
  <TooltipView />
{:else}
  <Loader />
{/if}

<style>
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage__wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  body {
    -webkit-touch-callout: none; /* Disable callout, image save panel on long-touch */
    -webkit-user-select: none; /* Disable selection */
    -khtml-user-select: none; /* Disable selection */
    -moz-user-select: none; /* Disable selection */
    -ms-user-select: none; /* Disable selection */
    user-select: none; /* Disable selection */
  }
</style>
