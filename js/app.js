(function () {
  const D = window.CATU_HITO;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const state = { view: "home", mode: "express", ei: 0, fi: 0, express: {}, fronts: {} };
  function save() {
    try { localStorage.setItem("catu-hito", JSON.stringify({ express: state.express, fronts: state.fronts })); } catch (e) {}
  }
  function load() {
    try {
      const raw = localStorage.getItem("catu-hito");
      if (!raw) return;
      const o = JSON.parse(raw);
      state.express = o.express || {};
      state.fronts = o.fronts || {};
    } catch (e) {}
  }
  function answeredExpress() {
    return D.express.filter((q) => state.express[q.id]).length;
  }
  function gateStatus(gid) {
    const qs = D.express.filter((q) => q.gate === gid);
    const ans = qs.filter((q) => state.express[q.id]);
    if (!ans.length) return "empty";
    const pass = qs.every((q) => state.express[q.id] === "si");
    if (pass) return "pass";
    if (ans.length < qs.length) return "open";
    return "fail";
  }
  function computeHito() {
    if (answeredExpress() < D.minExpress) return { key: null, pending: true };
    const order = ["T12", "T6", "T3", "T0", "T30"];
    for (const g of order) {
      const qs = D.express.filter((q) => q.gate === g);
      const allSi = qs.every((q) => state.express[q.id] === "si");
      if (!allSi) {
        if (g === "T12") {
          const anySi = qs.some((q) => state.express[q.id] === "si");
          return { key: anySi ? "T12" : "PRE", pending: false };
        }
        return { key: g, pending: false };
      }
    }
    return { key: "POST", pending: false };
  }
  function threeGaps() {
    const out = [];
    for (const q of D.express) {
      const a = state.express[q.id];
      if (a === "no" || a === "ns") {
        out.push({ id: q.id, text: q.text, gate: q.gate, law: q.law, kind: a === "ns" ? "No se sabe" : "No" });
      }
      if (out.length === 3) break;
    }
    return out;
  }
  function frontStatus(id) {
    const a = state.fronts[id + "-0"];
    const b = state.fronts[id + "-1"];
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
    const n = answeredExpress();
    $("#sticky-count").textContent = n + " / 15";
    const h = computeHito();
    $("#sticky-hint").textContent = h.pending ? "Aún se está armando la foto" : (D.verdicts[h.key] || {}).hito || "—";
    $("#sticky-bar").style.width = Math.round((n / 15) * 100) + "%";
  }
  function renderExpress() {
    const q = D.express[state.ei];
    const gate = D.gates.find((g) => g.id === q.gate);
    $("#ex-progress").textContent = "Pregunta " + (state.ei + 1) + " de 15";
    $("#ex-gate").textContent = gate.title;
    $("#ex-law").textContent = q.law;
    $("#ex-text").textContent = q.text;
    $$("#ex-opts button").forEach((b) => {
      b.classList.toggle("on", state.express[q.id] === b.dataset.v);
    });
    $("#btn-ex-prev").disabled = state.ei === 0;
    $("#btn-ex-next").textContent = state.ei === D.express.length - 1 ? "Ver resultado" : "Siguiente";
    const pipe = $("#ex-pipe");
    pipe.innerHTML = D.gates.map((g) => {
      const st = gateStatus(g.id);
      return `<button type="button" class="pipe ${st} ${q.gate === g.id ? "active" : ""}" data-g="${g.id}"><strong>${g.label}</strong></button>`;
    }).join("");
    paintSticky();
  }
  function renderFront() {
    const f = D.fronts[state.fi];
    $("#fr-progress").textContent = "Área " + (state.fi + 1) + " de 12";
    $("#fr-name").textContent = f.name;
    const box = $("#fr-qs");
    box.innerHTML = f.q.map((text, i) => {
      const key = f.id + "-" + i;
      const cur = state.fronts[key];
      return `<article class="qcard"><p>${text}</p><div class="opts">
        <button type="button" data-k="${key}" data-v="si" class="${cur === "si" ? "on" : ""}">Sí</button>
        <button type="button" data-k="${key}" data-v="no" class="${cur === "no" ? "on" : ""}">No</button>
        <button type="button" data-k="${key}" data-v="ns" class="${cur === "ns" ? "on" : ""}">No sé</button>
      </div></article>`;
    }).join("");
    const rail = $("#fr-rail");
    rail.innerHTML = D.fronts.map((x, i) => {
      const st = frontStatus(x.id);
      return `<button type="button" class="dot ${st} ${i === state.fi ? "active" : ""}" data-i="${i}" title="${x.name}">${i + 1}</button>`;
    }).join("");
    $("#btn-fr-prev").disabled = state.fi === 0;
    $("#btn-fr-next").textContent = state.fi === D.fronts.length - 1 ? "Ver resultado" : "Siguiente área";
  }
  function renderResult() {
    const h = computeHito();
    const v = h.pending ? null : D.verdicts[h.key];
    $("#res-badge").textContent = h.pending ? "Faltan respuestas" : "Etapa en la que entra";
    $("#res-hito").textContent = h.pending ? "Todavía no alcanza para un resultado" : v.hito;
    $("#res-title").textContent = h.pending ? "Complete al menos 8 preguntas del recorrido corto." : v.title;
    $("#res-desc").textContent = h.pending ? "Con «No sé» también cuenta: marca lo que hay que verificar." : v.desc;
    $("#res-n").textContent = answeredExpress() + " de 15 preguntas";
    const gaps = threeGaps();
    const gl = $("#res-gaps");
    if (!gaps.length) {
      gl.innerHTML = "<p class='muted'>No hay pendientes marcados como No / No sé.</p>";
    } else {
      gl.innerHTML = gaps.map((g, i) => `<article class="gap"><span>0${i + 1} · ${g.kind} · ${g.gate}</span><p>${g.text}</p></article>`).join("");
    }
    const bars = $("#res-gates");
    bars.innerHTML = D.gates.map((g) => {
      const st = gateStatus(g.id);
      const qs = D.express.filter((q) => q.gate === g.id);
      const yes = qs.filter((q) => state.express[q.id] === "si").length;
      return `<div class="gbar ${st}"><div class="gbar-lab"><b>${g.label}</b> ${g.title}</div><div class="gbar-track"><i style="width:${Math.round((yes / qs.length) * 100)}%"></i></div><div class="gbar-n">${yes}/${qs.length}</div></div>`;
    }).join("");
    const fr = $("#res-fronts");
    fr.innerHTML = D.fronts.map((f) => {
      const st = frontStatus(f.id);
      const label = { empty: "Sin llenar", ok: "Operable", mid: "Incompleto", off: "Vacío" }[st];
      return `<li class="${st}"><b>${f.name}</b><span>${label}</span></li>`;
    }).join("");
    $("#res-cta-mail").href = "mailto:" + D.contactEmail +
      "?subject=" + encodeURIComponent("Diagnóstico de hito ER – CATU") +
      "&body=" + encodeURIComponent(mailBody(h, v, gaps));
  }
  function mailBody(h, v, gaps) {
    const lines = [
      "Diagnóstico rápido de cierre municipal — CATU.",
      "No es dictamen de auditoría.",
      "",
      h.pending ? "Resultado pendiente." : "Etapa: " + v.hito,
      h.pending ? "" : v.title,
      "",
      "Pendientes:",
      ...(gaps.length ? gaps.map((g, i) => (i + 1) + ". [" + g.kind + " / " + g.gate + "] " + g.text) : ["(ninguno marcado)"]),
      "",
      "Siguiente paso: llamada de 20 minutos con Tesorería y el OIC."
    ];
    return lines.join("\n");
  }
  function setExpress(val) {
    const q = D.express[state.ei];
    state.express[q.id] = val;
    save();
    renderExpress();
    if (state.ei < D.express.length - 1) {
      setTimeout(function () { state.ei += 1; renderExpress(); }, 160);
    }
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act]");
    if (t) {
      const act = t.dataset.act;
      if (act === "express") { state.mode = "express"; show("screen-express"); renderExpress(); }
      if (act === "taller") { state.mode = "taller"; show("screen-taller"); renderFront(); }
      if (act === "home") show("screen-home");
      if (act === "result") { show("screen-result"); renderResult(); }
      if (act === "reset") {
        if (confirm("¿Borrar las respuestas de este dispositivo?")) {
          state.express = {}; state.fronts = {}; save();
          show("screen-home"); paintSticky();
        }
      }
      if (act === "print") window.print();
      if (act === "share") {
        const url = location.href.split("#")[0];
        if (navigator.share) navigator.share({ title: "Monitor de Hito ER – CATU", url }).catch(() => {});
        else navigator.clipboard.writeText(url).then(() => alert("Enlace copiado."));
      }
    }
    if (e.target.closest("#ex-opts button")) {
      setExpress(e.target.closest("button").dataset.v);
    }
    if (e.target.closest("#btn-ex-next")) {
      if (state.ei < D.express.length - 1) { state.ei += 1; renderExpress(); }
      else { show("screen-result"); renderResult(); }
    }
    if (e.target.closest("#btn-ex-prev")) {
      if (state.ei > 0) { state.ei -= 1; renderExpress(); }
    }
    if (e.target.closest("#ex-pipe button")) {
      const g = e.target.closest("button").dataset.g;
      const idx = D.express.findIndex((q) => q.gate === g);
      if (idx >= 0) { state.ei = idx; renderExpress(); }
    }
    if (e.target.closest("#fr-qs button")) {
      const b = e.target.closest("button");
      state.fronts[b.dataset.k] = b.dataset.v;
      save();
      renderFront();
    }
    if (e.target.closest("#btn-fr-next")) {
      if (state.fi < D.fronts.length - 1) { state.fi += 1; renderFront(); }
      else { show("screen-result"); renderResult(); }
    }
    if (e.target.closest("#btn-fr-prev")) {
      if (state.fi > 0) { state.fi -= 1; renderFront(); }
    }
    if (e.target.closest("#fr-rail button")) {
      state.fi = Number(e.target.closest("button").dataset.i);
      renderFront();
    }
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js?v=3").catch(() => {});
  }
  document.body.dataset.screen = "screen-home";
  load();
  paintSticky();
})();
