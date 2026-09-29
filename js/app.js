(function () {
  const D = window.CATU_HITO;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const state = { view: "home", mode: "express", track: "hito", ei: 0, fi: 0, express: {}, cero: {}, fronts: {} };
  function save() {
    try { localStorage.setItem("catu-hito", JSON.stringify({ express: state.express, cero: state.cero, fronts: state.fronts })); } catch (e) {}
  }
  function load() {
    try {
      const raw = localStorage.getItem("catu-hito");
      if (!raw) return;
      const o = JSON.parse(raw);
      state.express = o.express || {};
      state.cero = o.cero || {};
      state.fronts = o.fronts || {};
    } catch (e) {}
  }
  function answeredExpress() { return D.express.filter((q) => state.express[q.id]).length; }
  function answeredCero() { return D.cero.filter((q) => state.cero[q.id]).length; }
  function gateStatus(gid) {
    const qs = D.express.filter((q) => q.gate === gid);
    const ans = qs.filter((q) => state.express[q.id]);
    if (!ans.length) return "empty";
    if (qs.every((q) => state.express[q.id] === "si")) return "pass";
    if (ans.length < qs.length) return "open";
    return "fail";
  }
  function computeHito() {
    if (state.track === "cero") {
      if (answeredCero() < D.minCero) return { key: null, pending: true };
      return { key: "CERO", pending: false };
    }
    if (answeredExpress() < D.minExpress) return { key: null, pending: true };
    const order = ["T12", "T6", "T3", "T0", "T30"];
    for (const g of order) {
      const qs = D.express.filter((q) => q.gate === g);
      if (!qs.every((q) => state.express[q.id] === "si")) {
        if (g === "T12") return { key: qs.some((q) => state.express[q.id] === "si") ? "T12" : "PRE", pending: false };
        return { key: g, pending: false };
      }
    }
    return { key: "POST", pending: false };
  }
  function threeGaps() {
    const out = [];
    const list = state.track === "cero" ? D.cero : D.express;
    const bag = state.track === "cero" ? state.cero : state.express;
    for (const q of list) {
      const a = bag[q.id];
      if (a === "no" || a === "ns") out.push({ text: q.text, gate: q.gate || q.block, law: q.law, kind: a === "ns" ? "No se sabe" : "No" });
      if (out.length === 3) break;
    }
    return out;
  }
  function frontStatus(id) {
    const a = state.fronts[id + "-0"], b = state.fronts[id + "-1"];
    const yes = [a, b].filter((x) => x === "si").length;
    if (!a && !b) return "empty";
    if (yes === 2) return "ok";
    if (yes === 1) return "mid";
    return "off";
  }
  function show(id) {
    $$(".screen").forEach((s) => s.classList.remove("active"));
    const el = $("#" + id);
    if (el) el.classList.add("active");
    state.view = id;
    document.body.dataset.screen = id;
    window.scrollTo(0, 0);
  }
  function paintSticky() {
    const total = state.track === "cero" ? D.cero.length : 15;
    const n = state.track === "cero" ? answeredCero() : answeredExpress();
    $("#sticky-count").textContent = n + " / " + total;
    const h = computeHito();
    $("#sticky-hint").textContent = h.pending ? "Aún se está armando la foto" : ((D.verdicts[h.key] || {}).hito || "—");
    $("#sticky-bar").style.width = Math.round((n / total) * 100) + "%";
  }
  function renderExpress() {
    const list = state.track === "cero" ? D.cero : D.express;
    const bag = state.track === "cero" ? state.cero : state.express;
    const q = list[state.ei];
    $("#ex-progress").textContent = "Pregunta " + (state.ei + 1) + " de " + list.length;
    $("#ex-gate").textContent = state.track === "cero" ? q.block : D.gates.find((g) => g.id === q.gate).title;
    $("#ex-law").textContent = q.law;
    $("#ex-text").textContent = q.text;
    $$("#ex-opts button").forEach((b) => b.classList.toggle("on", bag[q.id] === b.dataset.v));
    $("#btn-ex-prev").disabled = state.ei === 0;
    $("#btn-ex-next").textContent = state.ei === list.length - 1 ? "Ver resultado" : "Siguiente";
    const pipe = $("#ex-pipe");
    pipe.innerHTML = state.track === "cero" ? "" : D.gates.map((g) => {
      const st = gateStatus(g.id);
      return `<button type="button" class="pipe ${st} ${q.gate === g.id ? "active" : ""}" data-g="${g.id}"><strong>${g.label}</strong></button>`;
    }).join("");
    paintSticky();
  }
  function renderFront() {
    const f = D.fronts[state.fi];
    $("#fr-progress").textContent = "Área " + (state.fi + 1) + " de 12";
    $("#fr-name").textContent = f.name;
    $("#fr-qs").innerHTML = f.q.map((text, i) => {
      const key = f.id + "-" + i, cur = state.fronts[key];
      return `<article class="qcard"><p>${text}</p><div class="opts">
        <button type="button" data-k="${key}" data-v="si" class="${cur === "si" ? "on" : ""}">Sí</button>
        <button type="button" data-k="${key}" data-v="no" class="${cur === "no" ? "on" : ""}">No</button>
        <button type="button" data-k="${key}" data-v="ns" class="${cur === "ns" ? "on" : ""}">No sé</button></div></article>`;
    }).join("");
    $("#fr-rail").innerHTML = D.fronts.map((x, i) => `<button type="button" class="dot ${frontStatus(x.id)} ${i === state.fi ? "active" : ""}" data-i="${i}">${i + 1}</button>`).join("");
    $("#btn-fr-prev").disabled = state.fi === 0;
    $("#btn-fr-next").textContent = state.fi === D.fronts.length - 1 ? "Ver resultado" : "Siguiente área";
  }
  function renderResult() {
    const h = computeHito();
    const v = h.pending ? null : D.verdicts[h.key];
    const isCero = state.track === "cero";
    $("#res-badge").textContent = h.pending ? "Faltan respuestas" : (isCero ? "Diagnóstico preliminar" : "Etapa en la que entra");
    $("#res-hito").textContent = h.pending ? "Todavía no alcanza para un resultado" : v.hito;
    $("#res-title").textContent = h.pending ? (isCero ? "Complete al menos 6 preguntas de lo cotidiano." : "Complete al menos 8 preguntas del recorrido.") : v.title;
    $("#res-desc").textContent = h.pending ? "Con «No sé» también cuenta." : v.desc;
    $("#res-n").textContent = isCero ? answeredCero() + " de 10 preguntas" : answeredExpress() + " de 15 preguntas";
    const gaps = threeGaps();
    $("#res-gaps").innerHTML = gaps.length ? gaps.map((g, i) => `<article class="gap"><span>0${i + 1} · ${g.kind} · ${g.gate}</span><p>${g.text}</p></article>`).join("") : "<p class='muted'>No hay pendientes marcados.</p>";
    if (isCero) {
      const blocks = [];
      D.cero.forEach((q) => { if (blocks.indexOf(q.block) < 0) blocks.push(q.block); });
      $("#res-gates").innerHTML = blocks.map((name) => {
        const qs = D.cero.filter((q) => q.block === name);
        const yes = qs.filter((q) => state.cero[q.id] === "si").length;
        const st = yes === qs.length ? "pass" : (yes === 0 ? "fail" : "open");
        return `<div class="gbar ${st}"><div class="gbar-lab"><b>${name}</b></div><div class="gbar-track"><i style="width:${Math.round((yes / qs.length) * 100)}%"></i></div><div class="gbar-n">${yes}/${qs.length}</div></div>`;
      }).join("");
      $("#res-gaps-title").textContent = "Por dónde arrancar";
      $("#res-gates-title").textContent = "Lo que ya existe en la administración";
      $("#res-fronts-title").textContent = "Tres movimientos de arranque";
      $("#res-fronts").innerHTML = ["Nombrar a quien coordine la entrega-recepción (nombre y cargo).","Fijar el mes en que debe firmarse el acta.","Separar FAISMUN y FORTAMUN y sentar las conciliaciones del último mes."].map((t) => `<li class="mid"><b>${t}</b></li>`).join("");
    } else {
      $("#res-gates").innerHTML = D.gates.map((g) => {
        const qs = D.express.filter((q) => q.gate === g.id);
        const yes = qs.filter((q) => state.express[q.id] === "si").length;
        return `<div class="gbar ${gateStatus(g.id)}"><div class="gbar-lab"><b>${g.label}</b> ${g.title}</div><div class="gbar-track"><i style="width:${Math.round((yes / qs.length) * 100)}%"></i></div><div class="gbar-n">${yes}/${qs.length}</div></div>`;
      }).join("");
      $("#res-gaps-title").textContent = "Qué conviene atender primero";
      $("#res-gates-title").textContent = "Etapas";
      $("#res-fronts-title").textContent = "Áreas";
      $("#res-fronts").innerHTML = D.fronts.map((f) => {
        const st = frontStatus(f.id);
        const label = { empty: "Sin llenar", ok: "Operable", mid: "Incompleto", off: "Vacío" }[st];
        return `<li class="${st}"><b>${f.name}</b><span>${label}</span></li>`;
      }).join("");
    }
    $("#res-cta-mail").href = "mailto:" + D.contactEmail + "?subject=" + encodeURIComponent("Diagnóstico ER – CATU") + "&body=" + encodeURIComponent(mailBody(h, v, gaps));
  }
  function mailBody(h, v, gaps) {
    return ["Diagnóstico preliminar de cierre municipal — CATU.", "No es dictamen de auditoría.", "", h.pending ? "Resultado pendiente." : ((v && v.hito) || ""), "", "Pendientes:", ...(gaps.length ? gaps.map((g, i) => (i + 1) + ". [" + g.kind + "] " + g.text) : ["(ninguno)"]), "", "Siguiente paso: llamada de 20 minutos con Tesorería y el OIC."].join("\n");
  }
  function setExpress(val) {
    const list = state.track === "cero" ? D.cero : D.express;
    const bag = state.track === "cero" ? state.cero : state.express;
    bag[list[state.ei].id] = val;
    save();
    renderExpress();
    if (state.ei < list.length - 1) setTimeout(function () { state.ei += 1; renderExpress(); }, 160);
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act]");
    if (t) {
      const act = t.dataset.act;
      if (act === "cero") { state.track = "cero"; state.ei = 0; show("screen-express"); renderExpress(); }
      if (act === "express") { state.track = "hito"; state.ei = 0; show("screen-express"); renderExpress(); }
      if (act === "taller") { state.track = "hito"; show("screen-taller"); renderFront(); }
      if (act === "home") show("screen-home");
      if (act === "result") { show("screen-result"); renderResult(); }
      if (act === "reset" && confirm("¿Borrar las respuestas de este dispositivo?")) {
        state.express = {}; state.cero = {}; state.fronts = {}; save(); show("screen-home"); paintSticky();
      }
      if (act === "print") window.print();
    }
    if (e.target.closest("#ex-opts button")) setExpress(e.target.closest("button").dataset.v);
    if (e.target.closest("#btn-ex-next")) {
      const listN = state.track === "cero" ? D.cero : D.express;
      if (state.ei < listN.length - 1) { state.ei += 1; renderExpress(); }
      else { show("screen-result"); renderResult(); }
    }
    if (e.target.closest("#btn-ex-prev") && state.ei > 0) { state.ei -= 1; renderExpress(); }
    if (e.target.closest("#ex-pipe button") && state.track !== "cero") {
      const idx = D.express.findIndex((q) => q.gate === e.target.closest("button").dataset.g);
      if (idx >= 0) { state.ei = idx; renderExpress(); }
    }
    if (e.target.closest("#fr-qs button")) {
      const b = e.target.closest("button");
      state.fronts[b.dataset.k] = b.dataset.v; save(); renderFront();
    }
    if (e.target.closest("#btn-fr-next")) {
      if (state.fi < D.fronts.length - 1) { state.fi += 1; renderFront(); }
      else { show("screen-result"); renderResult(); }
    }
    if (e.target.closest("#btn-fr-prev") && state.fi > 0) { state.fi -= 1; renderFront(); }
    if (e.target.closest("#fr-rail button")) { state.fi = Number(e.target.closest("button").dataset.i); renderFront(); }
  });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js?v=4").catch(() => {});
  document.body.dataset.screen = "screen-home";
  load();
  paintSticky();
})();
