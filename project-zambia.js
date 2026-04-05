/* global d3 */
(function () {
  if (typeof d3 === "undefined") return;

  var mount = document.getElementById("zambia-graph-mount");
  if (!mount) return;

  /** Which hub has its leaves shown (only one at a time). Direct children of Zambia are always visible. */
  var expandedHubId = null;
  /** Within expanded hub: one tier-1 leaf whose subtree is open; null = only top-level leaves (majors). */
  var expandedMajorLeafId = null;
  var selectedId = null;
  /** After selection: pin all nodes once force alpha drops (also used after resize rebuild). */
  var needsSelectionPin = false;
  var SELECTION_PIN_ALPHA = 0.08;
  /** Persist layout across rebuilds (hub expand / resize) while positions stay meaningful. */
  var nodePositionCache = {};

  var palette = {
    center: { fill: "#F6C544", stroke: "#E85A0C", text: "#3d2918" },
    scope: { fill: "#e8f0d8", stroke: "#3E6F2A", text: "#1e3d14" },
    sensors: { fill: "#e4efd9", stroke: "#5E8C3B", text: "#1a3010" },
    leaf: { fill: "#ffffff", stroke: "#F47C1B", text: "#3d2918" },
    link: "#c9783a",
    linkDim: "#e5ddd4",
  };

  var NODE_DEFS = [
    { id: "zambia", label: "Zambia", sub: "project hub", kind: "center", branch: "center", r: 74 },
    { id: "edu", label: "Education", sub: "", kind: "hub", branch: "scope", r: 64 },
    {
      id: "edu-llm",
      label: "Local LLM",
      sub: "for education",
      kind: "leaf",
      branch: "scope",
      r: 58,
    },
    { id: "microscope", label: "Microscope", sub: "", kind: "hub", branch: "scope", r: 72 },
    {
      id: "openflexure",
      label: "Openflux",
      sub: "",
      kind: "leaf",
      branch: "scope",
      r: 72,
    },
    {
      id: "foldmicroscope",
      label: "FoldMicroscope",
      sub: "Compact folded-optics and paper-friendly microscopy concepts.",
      kind: "leaf",
      branch: "scope",
      r: 58,
    },
    {
      id: "sensors",
      label: "Smart sensors",
      sub: "",
      kind: "hub",
      branch: "sensors",
      r: 64,
    },
    {
      id: "sensors-gis-wildlife",
      label: "Sensor GIS",
      sub: "for wildlife",
      kind: "leaf",
      branch: "sensors",
      r: 58,
    },
  ];

  var LINK_DEFS = [
    { source: "zambia", target: "edu" },
    { source: "edu", target: "edu-llm" },
    { source: "zambia", target: "microscope" },
    { source: "microscope", target: "openflexure" },
    { source: "microscope", target: "foldmicroscope" },
    { source: "zambia", target: "sensors" },
    { source: "sensors", target: "sensors-gis-wildlife" },
  ];

  var CHILDREN_OF = {};
  LINK_DEFS.forEach(function (l) {
    if (!CHILDREN_OF[l.source]) CHILDREN_OF[l.source] = [];
    CHILDREN_OF[l.source].push(l.target);
  });

  function parentOfNode(nodeId) {
    for (var i = 0; i < LINK_DEFS.length; i++) {
      if (LINK_DEFS[i].target === nodeId) return LINK_DEFS[i].source;
    }
    return null;
  }

  function tier1LeafHasSubtree(leafId) {
    var ch = CHILDREN_OF[leafId];
    if (!ch || !ch.length) return false;
    for (var i = 0; i < ch.length; i++) {
      var n = NODE_DEFS.find(function (x) { return x.id === ch[i]; });
      if (n && n.kind === "leaf") return true;
    }
    return false;
  }

  function isUnderExpandedMajor(leafId) {
    if (!expandedMajorLeafId) return false;
    var cur = leafId;
    for (var g = 0; g < 12 && cur; g++) {
      var p = parentOfNode(cur);
      if (p === expandedMajorLeafId) return true;
      if (p === expandedHubId || !p) return false;
      cur = p;
    }
    return false;
  }

  /** In-node bench photo on OpenFlexure leaf */
  var OPENFLEX_THUMB_FR = 0.44;
  var OPENFLEX_THUMB_CY_FR = -0.38;

  var LEAF_TO_HUB = {
    "edu-llm": "edu",
    openflexure: "microscope",
    foldmicroscope: "microscope",
    "sensors-gis-wildlife": "sensors",
  };

  function branchColors(branch) {
    if (branch === "center") return palette.center;
    if (branch === "scope") return palette.scope;
    if (branch === "sensors") return palette.sensors;
    return palette.leaf;
  }

  function leafVisible(leafId) {
    var hub = LEAF_TO_HUB[leafId];
    if (!hub) return false;
    if (hub === "zambia") return true;
    return expandedHubId === hub;
  }

  function nodeVisible(n) {
    if (n.kind !== "leaf") return true;
    if (!leafVisible(n.id)) return false;
    var p = parentOfNode(n.id);
    if (p === expandedHubId) return true;
    if (p === "zambia") return true;
    return isUnderExpandedMajor(n.id);
  }

  function wrapLabelText(selection, text, maxCharsPerLine) {
    var words = text.split(/\s+/);
    var lines = [];
    var line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (test.length > maxCharsPerLine && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    selection.selectAll("tspan").remove();
    lines.forEach(function (ln, i) {
      selection
        .append("tspan")
        .attr("x", 0)
        .attr("dy", i === 0 ? 0 : "1.05em")
        .text(ln);
    });
  }

  function linkEndpoints(l) {
    var s = typeof l.source === "object" ? l.source.id : l.source;
    var t = typeof l.target === "object" ? l.target.id : l.target;
    return { s: s, t: t };
  }

  function neighborhood(id) {
    var out = {};
    out[id] = true;
    LINK_DEFS.forEach(function (link) {
      if (link.source === id) out[link.target] = true;
      else if (link.target === id) out[link.source] = true;
    });
    return out;
  }

  var width = 0;
  var height = 0;
  var svg;
  var zoomLayer;
  var linkG;
  var nodeG;
  var simulation;
  var zoomBehavior;
  var centerPinned = true;
  var nodes;
  var links;

  function applyHighlight() {
    var dim = selectedId !== null;
    var keep = dim ? neighborhood(selectedId) : null;

    if (!dim) {
      needsSelectionPin = false;
      if (simulation && nodes) {
        var hadLock = false;
        nodes.forEach(function (n) {
          if (n.id === "zambia" && centerPinned) return;
          if (n.fx != null || n.fy != null) hadLock = true;
          n.fx = null;
          n.fy = null;
        });
        if (hadLock) simulation.alpha(0.5).restart();
      }
    } else {
      needsSelectionPin = true;
    }

    linkG.selectAll("line").each(function (d) {
      var end = linkEndpoints(d);
      var on = !dim || (keep[end.s] && keep[end.t]);
      var touchesSelected =
        dim && selectedId && (end.s === selectedId || end.t === selectedId);
      d3.select(this)
        .style("stroke", on ? palette.link : palette.linkDim)
        .style(
          "stroke-width",
          on ? (touchesSelected ? 4.4 : dim ? 3.2 : 2.6) : 1.5
        )
        .style("opacity", on ? (dim ? 1 : 0.9) : 0.28);
    });

    nodeG.selectAll("g.zambia-fnode").each(function (d) {
      var g = d3.select(this);
      var isSel = selectedId === d.id;
      var isNbr = dim && keep[d.id] && !isSel;
      g.classed("is-selected", isSel);
      g.classed("is-neighbor", isNbr);
      g.classed("is-expanded", d.kind === "hub" && expandedHubId === d.id);
      g.classed(
        "is-major-expanded",
        d.kind === "leaf" && expandedMajorLeafId === d.id
      );
      g.style("opacity", !dim || keep[d.id] ? 1 : 0.2);
    });
  }

  function clearHighlight() {
    selectedId = null;
    applyHighlight();
  }

  function prepareNewLeafSelection(prevSel, nextSel) {
    if (nextSel === null || !simulation || !nodes) return;
    if (prevSel === nextSel) return;
    nodes.forEach(function (n) {
      if (n.id === "zambia" && centerPinned) return;
      n.fx = null;
      n.fy = null;
    });
    simulation.alpha(0.45).restart();
  }

  function collapseExpansion() {
    expandedHubId = null;
    expandedMajorLeafId = null;
  }

  function tick() {
    if (centerPinned) {
      var z = nodes.find(function (n) { return n.id === "zambia"; });
      if (z) {
        z.fx = width / 2;
        z.fy = height / 2;
      }
    }

    if (
      selectedId &&
      needsSelectionPin &&
      simulation &&
      simulation.alpha() < SELECTION_PIN_ALPHA
    ) {
      nodes.forEach(function (n) {
        if (n.id === "zambia" && centerPinned) {
          n.fx = width / 2;
          n.fy = height / 2;
        } else {
          n.fx = n.x;
          n.fy = n.y;
        }
      });
      simulation.alphaTarget(0);
      needsSelectionPin = false;
    }

    nodes.forEach(function (n) {
      if (n.x != null && n.y != null && !isNaN(n.x) && !isNaN(n.y)) {
        nodePositionCache[n.id] = { x: n.x, y: n.y };
      }
    });

    linkG
      .selectAll("line")
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    nodeG.selectAll("g.zambia-fnode").attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }

  function drag(simulation) {
    function started(event) {
      if (!event.active) simulation.alphaTarget(0.35).restart();
      var d = event.subject;
      if (d.id === "zambia" && centerPinned) return;
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event) {
      var d = event.subject;
      if (d.id === "zambia" && centerPinned) return;
      d.fx = event.x;
      d.fy = event.y;
    }
    function ended(event) {
      if (!event.active) simulation.alphaTarget(0);
      var d = event.subject;
      if (d.id === "zambia" && centerPinned) return;
      d.fx = null;
      d.fy = null;
    }
    return d3
      .drag()
      .filter(function (event) {
        if (selectedId !== null) return false;
        var t = event.sourceEvent && event.sourceEvent.target;
        if (t && t.closest && t.closest(".zambia-fnode__thumb-link")) return false;
        return !event.button;
      })
      .on("start", started)
      .on("drag", dragged)
      .on("end", ended);
  }

  function build() {
    var rect = mount.getBoundingClientRect();
    width = Math.max(320, Math.floor(rect.width));
    height = Math.max(560, Math.min(960, Math.floor(rect.width * 0.75)));

    var allNodes = NODE_DEFS.map(function (o) { return Object.assign({}, o); });
    nodes = allNodes.filter(nodeVisible);
    links = LINK_DEFS.map(function (o) {
      return { source: o.source, target: o.target };
    }).filter(function (l) {
      var ns = allNodes.find(function (n) { return n.id === l.source; });
      var nt = allNodes.find(function (n) { return n.id === l.target; });
      return ns && nt && nodeVisible(ns) && nodeVisible(nt);
    });

    if (selectedId && !nodes.some(function (n) { return n.id === selectedId; })) {
      selectedId = null;
    }

    mount.innerHTML = "";
    svg = d3
      .select(mount)
      .append("svg")
      .attr("class", "zambia-graph-svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    var uid = "z" + Date.now();
    var defs = svg.append("defs");
    nodes.forEach(function (d) {
      defs
        .append("clipPath")
        .attr("id", "zc-" + d.id + "-" + uid)
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", Math.max(12, d.r - 6));
    });

    defs
      .append("clipPath")
      .attr("id", "zm-micro-thumb-" + uid)
      .attr("clipPathUnits", "objectBoundingBox")
      .append("circle")
      .attr("cx", 0.5)
      .attr("cy", 0.5)
      .attr("r", 0.48);

    svg
      .append("rect")
      .attr("class", "zambia-graph-viewport-frame")
      .attr("x", 0)
      .attr("y", 0)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("stroke", "none")
      .attr("pointer-events", "none");

    zoomLayer = svg.append("g").attr("class", "zambia-graph-zoom-layer");

    zoomBehavior = d3
      .zoom()
      .scaleExtent([0.22, 4])
      .filter(function (event) {
        if (event.type === "dblclick") return false;
        if (event.type === "wheel") return true;
        return event.target && event.target.classList.contains("zambia-graph-hitplane");
      })
      .on("zoom", function (event) {
        zoomLayer.attr("transform", event.transform);
      });

    svg.call(zoomBehavior).on("dblclick.zoom", null);
    svg.on("dblclick", function (event) {
      event.preventDefault();
    });

    zoomLayer
      .append("rect")
      .attr("class", "zambia-graph-hitplane")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .attr("stroke", "none")
      .style("cursor", "grab");

    var root = zoomLayer.append("g").attr("class", "zambia-graph-root");

    linkG = root.append("g").attr("class", "zambia-links");

    var linkForce = d3
      .forceLink(links)
      .id(function (d) { return d.id; })
      .distance(function (d) {
        var end = linkEndpoints(d);
        var sn = nodes.find(function (n) { return n.id === end.s; });
        var tn = nodes.find(function (n) { return n.id === end.t; });
        if (sn && tn && sn.kind === "leaf" && tn.kind === "leaf") return 205;
        if (tn && tn.kind === "leaf") return 175;
        if (tn && tn.kind === "hub") return 265;
        return 215;
      })
      .strength(0.75);

    simulation = d3
      .forceSimulation(nodes)
      .force("link", linkForce)
      .force("charge", d3.forceManyBody().strength(-620))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.06))
      .force(
        "collide",
        d3.forceCollide().radius(function (d) { return d.r + 32; })
      )
      .on("tick", tick);

    nodes.forEach(function (d, i) {
      var c = nodePositionCache[d.id];
      if (c && c.x != null && c.y != null && !isNaN(c.x) && !isNaN(c.y)) {
        d.x = c.x;
        d.y = c.y;
      } else {
        var angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2;
        var spread = d.kind === "center" ? 0 : 140 + (i % 7) * 28;
        d.x = width / 2 + Math.cos(angle) * spread;
        d.y = height / 2 + Math.sin(angle) * spread;
      }
    });

    linkG
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "zambia-link")
      .attr("stroke-linecap", "round")
      .style("pointer-events", "none");

    nodeG = root.append("g").attr("class", "zambia-nodes");

    var node = nodeG
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", function (d) {
        return "zambia-fnode zambia-fnode--" + d.kind + " zambia-fnode--" + d.branch;
      })
      .attr("data-node-id", function (d) { return d.id; })
      .attr("tabindex", 0)
      .attr("role", "button")
      .each(function (d) {
        var el = d3.select(this);
        if (d.kind === "hub") {
          el.attr("aria-expanded", expandedHubId === d.id);
        } else if (
          d.kind === "leaf" &&
          expandedHubId &&
          parentOfNode(d.id) === expandedHubId &&
          tier1LeafHasSubtree(d.id)
        ) {
          el.attr(
            "aria-expanded",
            expandedMajorLeafId === d.id ? "true" : "false"
          );
        } else {
          el.attr("aria-expanded", null);
        }
      })
      .style("cursor", "grab")
      .call(drag(simulation));

    node
      .append("circle")
      .attr("class", "zambia-fnode__halo")
      .attr("r", function (d) { return d.r + 10; });

    node.each(function (d) {
      var g = d3.select(this);
      var clipUrl = "url(#zc-" + d.id + "-" + uid + ")";
      var content = g.append("g").attr("class", "zambia-fnode__clip").attr("clip-path", clipUrl);

      content
        .append("circle")
        .attr("class", "zambia-fnode__fill")
        .attr("r", function (dn) { return dn.r; })
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("fill", function (dn) {
          if (dn.kind === "leaf" && dn.branch === "sensors") {
            return palette.sensors.fill;
          }
          if (dn.kind === "leaf") return palette.leaf.fill;
          return branchColors(dn.branch).fill;
        });

      var isOpenflexPhoto = d.id === "openflexure";
      if (isOpenflexPhoto) {
        var thumb = d.r * OPENFLEX_THUMB_FR;
        var thumbCy = d.r * OPENFLEX_THUMB_CY_FR;
        var thumbLink = content
          .append("a")
          .attr("class", "zambia-fnode__thumb-link")
          .attr("href", "https://openflexure.org")
          .attr("target", "_blank")
          .attr("rel", "noopener")
          .attr("aria-label", "Openflux — OpenFlexure project website");
        thumbLink
          .append("image")
          .attr("class", "zambia-fnode__thumb")
          .attr("href", "images/microscope-01.jpg")
          .attr("x", -thumb / 2)
          .attr("y", thumbCy - thumb / 2)
          .attr("width", thumb)
          .attr("height", thumb)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("clip-path", "url(#zm-micro-thumb-" + uid + ")")
          .attr("aria-hidden", "true");
      }

      var fill = branchColors(d.branch).text;
      var r = d.r;

      if (d.kind === "center") {
        content
          .append("text")
          .attr("class", "zambia-fnode__label zambia-fnode__label--center")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", -8)
          .attr("fill", fill)
          .text(d.label);
        content
          .append("text")
          .attr("class", "zambia-fnode__sub")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", 22)
          .attr("fill", fill)
          .style("opacity", 0.9)
          .text(d.sub);
      } else if (d.kind === "hub") {
        content
          .append("text")
          .attr("class", "zambia-fnode__label")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", 2)
          .attr("fill", fill)
          .text(d.label);
        if (d.sub) {
          var hubSubLong = d.sub.length > 22;
          var subHub = content
            .append("text")
            .attr("class", "zambia-fnode__sub")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", hubSubLong ? 18 : 20)
            .attr("fill", fill)
            .style("opacity", 0.88);
          if (hubSubLong) {
            wrapLabelText(subHub, d.sub, 18);
            subHub.selectAll("tspan").attr("x", 0);
          } else {
            subHub.text(d.sub);
          }
        }
      } else {
        var longSub = d.sub && d.sub.length > 20;
        var leafLabY = isOpenflexPhoto
          ? d.r * 0.1
          : d.sub
            ? (longSub ? -16 : -10)
            : 4;
        var leafLab = content
          .append("text")
          .attr("class", "zambia-fnode__label zambia-fnode__label--leaf")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", leafLabY)
          .attr("fill", fill);
        var maxCh = r < 52 ? 12 : 14;
        if (d.label.length > maxCh) {
          wrapLabelText(leafLab, d.label, maxCh);
          leafLab.selectAll("tspan").attr("x", 0);
        } else {
          leafLab.text(d.label);
        }
        if (d.sub) {
          var subWrap = isOpenflexPhoto ? 11 : 16;
          var subStartY = isOpenflexPhoto ? d.r * 0.26 : longSub ? 12 : 22;
          var subLeaf = content
            .append("text")
            .attr("class", "zambia-fnode__sub zambia-fnode__sub--leaf")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", subStartY)
            .attr("fill", fill)
            .style("opacity", 0.85);
          if (longSub || isOpenflexPhoto) {
            wrapLabelText(subLeaf, d.sub, subWrap);
            subLeaf.selectAll("tspan").attr("x", 0);
          } else {
            subLeaf.text(d.sub);
          }
        }
      }

      g.append("circle")
        .attr("class", "zambia-fnode__shape")
        .attr("r", function (dn) { return dn.r; })
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("fill", "none")
        .attr("stroke", function (dn) { return branchColors(dn.branch).stroke; })
        .attr("stroke-width", 3.25);
    });

    node
      .on("dblclick", function (event) {
        event.preventDefault();
        event.stopPropagation();
      });

    node.on("click", function (event, d) {
      event.stopPropagation();
      if (d.kind === "hub") {
        selectedId = null;
        if (expandedHubId === d.id) {
          expandedHubId = null;
          expandedMajorLeafId = null;
        } else {
          expandedHubId = d.id;
          expandedMajorLeafId = null;
        }
        build();
        return;
      }
      if (d.kind === "center") {
        collapseExpansion();
        selectedId = null;
        build();
        return;
      }
      if (d.kind === "leaf") {
        if (
          expandedHubId &&
          parentOfNode(d.id) === expandedHubId &&
          tier1LeafHasSubtree(d.id)
        ) {
          selectedId = null;
          expandedMajorLeafId =
            expandedMajorLeafId === d.id ? null : d.id;
          build();
          return;
        }
        var prevSel = selectedId;
        selectedId = selectedId === d.id ? null : d.id;
        prepareNewLeafSelection(prevSel, selectedId);
        applyHighlight();
      }
    });

    node.on("keydown", function (event, d) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (d.kind === "hub") {
        selectedId = null;
        if (expandedHubId === d.id) {
          expandedHubId = null;
          expandedMajorLeafId = null;
        } else {
          expandedHubId = d.id;
          expandedMajorLeafId = null;
        }
        build();
        return;
      }
      if (d.kind === "center") {
        collapseExpansion();
        selectedId = null;
        build();
        return;
      }
      if (d.kind === "leaf") {
        if (
          expandedHubId &&
          parentOfNode(d.id) === expandedHubId &&
          tier1LeafHasSubtree(d.id)
        ) {
          selectedId = null;
          expandedMajorLeafId =
            expandedMajorLeafId === d.id ? null : d.id;
          build();
          return;
        }
        var prevSelK = selectedId;
        selectedId = selectedId === d.id ? null : d.id;
        prepareNewLeafSelection(prevSelK, selectedId);
        applyHighlight();
      }
    });

    applyHighlight();
    simulation.alpha(1).restart();
  }

  var ro = new ResizeObserver(function () {
    build();
  });
  ro.observe(mount);

  build();

  var btnReset = document.getElementById("zambia-graph-reset-zoom");
  if (btnReset) {
    btnReset.addEventListener("click", function () {
      if (svg && zoomBehavior) {
        svg.transition().duration(320).call(zoomBehavior.transform, d3.zoomIdentity);
      }
      collapseExpansion();
      clearHighlight();
      build();
    });
  }

  var btnUnfix = document.getElementById("zambia-graph-unfix");
  if (btnUnfix) {
    btnUnfix.addEventListener("click", function () {
      centerPinned = !centerPinned;
      var z = nodes && nodes.find(function (n) { return n.id === "zambia"; });
      if (z) {
        z.fx = null;
        z.fy = null;
      }
      btnUnfix.setAttribute("aria-pressed", centerPinned ? "true" : "false");
      btnUnfix.textContent = centerPinned ? "Release center" : "Pin center";
      if (simulation) simulation.alpha(0.4).restart();
    });
  }

})();
