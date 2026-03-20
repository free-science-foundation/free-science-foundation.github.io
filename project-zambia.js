/* global d3 */
(function () {
  if (typeof d3 === "undefined") return;

  var mount = document.getElementById("zambia-graph-mount");
  if (!mount) return;

  /** Which hub has its leaves shown (only one at a time). null = first level only (Zambia + 3 hubs). */
  var expandedHubId = null;
  var selectedId = null;

  var palette = {
    center: { fill: "#F6C544", stroke: "#E85A0C", text: "#3d2918" },
    scope: { fill: "#e8f0d8", stroke: "#3E6F2A", text: "#1e3d14" },
    sensors: { fill: "#e4efd9", stroke: "#5E8C3B", text: "#1a3010" },
    consult: { fill: "#fde8d4", stroke: "#E94B3C", text: "#5c2410" },
    leaf: { fill: "#ffffff", stroke: "#F47C1B", text: "#3d2918" },
    link: "#c9783a",
    linkDim: "#e5ddd4",
  };

  var NODE_DEFS = [
    { id: "zambia", label: "Zambia", sub: "project hub", kind: "center", branch: "center", r: 74 },
    { id: "microscopy", label: "Microscopy", sub: "field optics", kind: "hub", branch: "scope", r: 80 },
    { id: "sensors", label: "Smart sensors", sub: "land & herds", kind: "hub", branch: "sensors", r: 80 },
    { id: "consult", label: "Consultancies", sub: "partnerships", kind: "hub", branch: "consult", r: 80 },
    { id: "edu", label: "Education", sub: "", kind: "leaf", branch: "scope", r: 58 },
    { id: "labs", label: "Labs", sub: "", kind: "leaf", branch: "scope", r: 58 },
    { id: "hospital", label: "Field hospitals", sub: "", kind: "leaf", branch: "scope", r: 58 },
    { id: "env", label: "Environment", sub: "", kind: "leaf", branch: "sensors", r: 58 },
    { id: "agri", label: "Agriculture", sub: "", kind: "leaf", branch: "sensors", r: 58 },
    { id: "animal", label: "Animal welfare", sub: "", kind: "leaf", branch: "sensors", r: 58 },
    { id: "ai", label: "AI upskill", sub: "non-profits", kind: "leaf", branch: "consult", r: 58 },
    { id: "uni", label: "Universities", sub: "", kind: "leaf", branch: "consult", r: 58 },
  ];

  var LINK_DEFS = [
    { source: "zambia", target: "microscopy" },
    { source: "zambia", target: "sensors" },
    { source: "zambia", target: "consult" },
    { source: "microscopy", target: "edu" },
    { source: "microscopy", target: "labs" },
    { source: "microscopy", target: "hospital" },
    { source: "sensors", target: "env" },
    { source: "sensors", target: "agri" },
    { source: "sensors", target: "animal" },
    { source: "consult", target: "ai" },
    { source: "consult", target: "uni" },
  ];

  /** Microscopy hub: small in-node thumb (upper disk) — shared with hover popout placement */
  var MICRO_THUMB_FR = 0.52;
  var MICRO_THUMB_CY_FR = -0.48;

  var LEAF_TO_HUB = {
    edu: "microscopy",
    labs: "microscopy",
    hospital: "microscopy",
    env: "sensors",
    agri: "sensors",
    animal: "sensors",
    ai: "consult",
    uni: "consult",
  };

  function branchColors(branch) {
    if (branch === "center") return palette.center;
    if (branch === "scope") return palette.scope;
    if (branch === "sensors") return palette.sensors;
    if (branch === "consult") return palette.consult;
    return palette.leaf;
  }

  function leafVisible(leafId) {
    return expandedHubId && LEAF_TO_HUB[leafId] === expandedHubId;
  }

  function nodeVisible(n) {
    if (n.kind !== "leaf") return true;
    return leafVisible(n.id);
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

    linkG.selectAll("line").each(function (d) {
      var end = linkEndpoints(d);
      var on = !dim || (keep[end.s] && keep[end.t]);
      d3.select(this)
        .style("stroke", on ? palette.link : palette.linkDim)
        .style("stroke-width", on ? (dim ? 3.2 : 2.6) : 1.5)
        .style("opacity", on ? (dim ? 1 : 0.9) : 0.28);
    });

    nodeG.selectAll("g.zambia-fnode").each(function (d) {
      var g = d3.select(this);
      g.classed("is-selected", selectedId === d.id);
      g.classed("is-expanded", d.kind === "hub" && expandedHubId === d.id);
      g.style("opacity", !dim || keep[d.id] ? 1 : 0.2);
    });
  }

  function clearHighlight() {
    selectedId = null;
    applyHighlight();
  }

  function collapseExpansion() {
    expandedHubId = null;
  }

  function tick() {
    if (centerPinned) {
      var z = nodes.find(function (n) { return n.id === "zambia"; });
      if (z) {
        z.fx = width / 2;
        z.fy = height / 2;
      }
    }

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
      .style("cursor", "grab");

    var root = zoomLayer.append("g").attr("class", "zambia-graph-root");

    linkG = root.append("g").attr("class", "zambia-links");

    var linkForce = d3
      .forceLink(links)
      .id(function (d) { return d.id; })
      .distance(function (d) {
        var t = d.target;
        var tid = typeof t === "object" ? t.id : t;
        var node = nodes.find(function (n) { return n.id === tid; });
        if (node && node.kind === "leaf") return 175;
        if (node && node.kind === "hub") return 265;
        return 215;
      })
      .strength(0.75);

    simulation = d3
      .forceSimulation(nodes)
      .force("link", linkForce)
      .force("charge", d3.forceManyBody().strength(-520))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.06))
      .force(
        "collide",
        d3.forceCollide().radius(function (d) { return d.r + 28; })
      )
      .on("tick", tick);

    nodes.forEach(function (d, i) {
      var angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2;
      var spread = d.kind === "center" ? 0 : 140 + (i % 7) * 28;
      d.x = width / 2 + Math.cos(angle) * spread;
      d.y = height / 2 + Math.sin(angle) * spread;
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
        .attr("fill", function (dn) { return branchColors(dn.branch).fill; });

      var isMicroscopy = d.id === "microscopy";
      if (isMicroscopy) {
        var thumb = d.r * MICRO_THUMB_FR;
        var thumbCy = d.r * MICRO_THUMB_CY_FR;
        var thumbLink = content
          .append("a")
          .attr("class", "zambia-fnode__thumb-link")
          .attr("href", "projects.html#project-zambia")
          .attr("aria-label", "View OpenFlexure & Project Zambia on Projects");
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
        var ly = isMicroscopy ? d.r * 0.18 : 2;
        var suby = isMicroscopy ? d.r * 0.44 : 22;
        content
          .append("text")
          .attr("class", "zambia-fnode__label")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", ly)
          .attr("fill", fill)
          .text(d.label);
        content
          .append("text")
          .attr("class", "zambia-fnode__sub")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", suby)
          .attr("fill", fill)
          .style("opacity", 0.88)
          .text(d.sub);
      } else {
        var leafLab = content
          .append("text")
          .attr("class", "zambia-fnode__label zambia-fnode__label--leaf")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", d.sub ? -10 : 4)
          .attr("fill", fill);
        var maxCh = r < 52 ? 12 : 14;
        if (d.label.length > maxCh) {
          wrapLabelText(leafLab, d.label, maxCh);
          leafLab.selectAll("tspan").attr("x", 0);
        } else {
          leafLab.text(d.label);
        }
        if (d.sub) {
          content
            .append("text")
            .attr("class", "zambia-fnode__sub zambia-fnode__sub--leaf")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 22)
            .attr("fill", fill)
            .style("opacity", 0.85)
            .text(d.sub);
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

      if (isMicroscopy) {
        var thumbR = d.r * MICRO_THUMB_FR;
        var thumbCyR = d.r * MICRO_THUMB_CY_FR;
        var slabPad = 8;
        var slabW = thumbR + slabPad * 2;
        var slabH = thumbR + slabPad * 2;
        var slabTop = -thumbR / 2 - slabPad;
        var hoverWrap = g
          .append("g")
          .attr("class", "zambia-fnode__thumb-hover-wrap")
          .attr("transform", "translate(0," + thumbCyR + ")");
        hoverWrap
          .append("rect")
          .attr("class", "zambia-fnode__thumb-hover-slab")
          .attr("x", -slabW / 2)
          .attr("y", slabTop)
          .attr("width", slabW)
          .attr("height", slabH)
          .attr("fill", "transparent")
          .style("pointer-events", "all")
          .attr("aria-hidden", "true");
      }
    });

    node
      .on("dblclick", function (event) {
        event.preventDefault();
        event.stopPropagation();
      })
      .on("pointerenter", function (event, d) {
        if (d.kind === "hub") {
          if (expandedHubId !== d.id) {
            expandedHubId = d.id;
            build();
          }
          return;
        }
        if (d.kind === "center") {
          if (expandedHubId !== null) {
            expandedHubId = null;
            build();
          }
          return;
        }
      })
      .on("focusin", function (event, d) {
        if (d.kind === "hub") {
          if (expandedHubId !== d.id) {
            expandedHubId = d.id;
            build();
          }
        } else if (d.kind === "center" && expandedHubId !== null) {
          expandedHubId = null;
          build();
        }
      });

    node.on("click", function (event, d) {
      event.stopPropagation();
      if (d.kind === "leaf") {
        selectedId = selectedId === d.id ? null : d.id;
        applyHighlight();
      }
    });

    node.on("keydown", function (event, d) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (d.kind === "hub") {
        expandedHubId = expandedHubId === d.id ? null : d.id;
        build();
        return;
      }
      if (d.kind === "center") {
        collapseExpansion();
        selectedId = null;
        build();
        return;
      }
      selectedId = selectedId === d.id ? null : d.id;
      applyHighlight();
    });

    simulation.alpha(1).restart();
    applyHighlight();
  }

  var ro = new ResizeObserver(function () {
    build();
  });
  ro.observe(mount);

  build();

  var microPreviewEl = document.getElementById("zambia-micro-preview");
  function showMicroPreview() {
    if (!microPreviewEl) return;
    microPreviewEl.classList.add("is-visible");
    microPreviewEl.removeAttribute("hidden");
    microPreviewEl.setAttribute("aria-hidden", "false");
  }
  function hideMicroPreview() {
    if (!microPreviewEl) return;
    microPreviewEl.classList.remove("is-visible");
    microPreviewEl.setAttribute("hidden", "");
    microPreviewEl.setAttribute("aria-hidden", "true");
  }

  var btnReset = document.getElementById("zambia-graph-reset-zoom");
  if (btnReset) {
    btnReset.addEventListener("click", function () {
      hideMicroPreview();
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

  if (microPreviewEl) {
    microPreviewEl.addEventListener("click", function (e) {
      if (!microPreviewEl.classList.contains("is-visible")) return;
      var frame = microPreviewEl.querySelector(".zambia-micro-preview__frame");
      if (frame && frame.contains(e.target)) return;
      hideMicroPreview();
    });
    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key !== "Escape") return;
        if (!microPreviewEl.classList.contains("is-visible")) return;
        hideMicroPreview();
      },
      true
    );
  }

  var graphWrapEl = document.querySelector(".zambia-graph-wrap");
  if (graphWrapEl && microPreviewEl) {
    graphWrapEl.addEventListener("mouseover", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest(".zambia-fnode__thumb-hover-slab")) {
        showMicroPreview();
      }
    });
    graphWrapEl.addEventListener("mouseout", function (e) {
      var t = e.target;
      if (!t || !t.closest || !t.closest(".zambia-fnode__thumb-hover-slab")) return;
      var rel = e.relatedTarget;
      if (rel && microPreviewEl.contains(rel)) return;
      if (rel && rel.closest && rel.closest(".zambia-fnode__thumb-hover-slab")) return;
      hideMicroPreview();
    });
    microPreviewEl.addEventListener("mouseout", function (e) {
      var rel = e.relatedTarget;
      if (rel && microPreviewEl.contains(rel)) return;
      if (rel && rel.closest && rel.closest(".zambia-fnode__thumb-hover-slab")) return;
      hideMicroPreview();
    });
  }
})();
