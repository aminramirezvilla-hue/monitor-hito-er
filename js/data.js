/* Monitor de Hito ER – CATU
   Traduce B2/C2 a un diagnóstico de entrada. No sustituye la matriz. */
window.CATU_HITO = {
  contactEmail: "centro.catu@gmail.com",
  formspree: "",
  minExpress: 8,
  gates: [
    { id: "T12", label: "T-12", title: "Gobierno del cierre", hint: "Dueños, R086, paramunicipales." },
    { id: "T6", label: "T-6", title: "Conciliación", hint: "Bancos, fondos, obra, nómina." },
    { id: "T3", label: "T-3", title: "Simulacro", hint: "Índice, ensayo, planes de críticos." },
    { id: "T0", label: "T0", title: "Acta", hint: "Firma, reservas, custodia." },
    { id: "T30", label: "T+30", title: "Aclaraciones", hint: "Art. 23, 30 días hábiles." }
  ],
  express: [
    { id: "e1", gate: "T12", law: "Ley 213 · gobierno del cierre", text: "¿Hay un dueño nominado del cierre —nombre y cargo—, no solo el Comité en el acta constitutiva?" },
    { id: "e2", gate: "T12", law: "B2 · asignación de frentes", text: "¿Tesorería, obra, RH y jurídico tienen responsable con nombre para el expediente de entrega?" },
    { id: "e3", gate: "T12", law: "R086", text: "¿En los últimos 90 días se revalidó la norma y la hipótesis de fecha T0 (Periódico Oficial / criterio institucional)?" },
    { id: "e4", gate: "T12", law: "B2 · paramunicipales", text: "¿Está el inventario de paramunicipales y cada uno tiene paquete propio o un plan escrito para armarlo?" },
    { id: "e5", gate: "T6", law: "LGCG · conciliaciones", text: "¿Hay conciliación bancaria del último mes cerrado, cuenta por cuenta, con estado de cuenta anexo?" },
    { id: "e6", gate: "T6", law: "LCF · FAISMUN / FORTAMUN", text: "¿FAISMUN y FORTAMUN viven en expedientes separados —no en una carpeta única de “fondos”?" },
    { id: "e7", gate: "T6", law: "Obra · actas de recepción", text: "¿Cada contrato de obra vivo tiene bitácora y, si ya concluyó, acta de entrega-recepción?" },
    { id: "e8", gate: "T6", law: "RH · plantilla", text: "¿La plantilla y la última nómina pagada cuadran entre sí?" },
    { id: "e9", gate: "T3", law: "B2 · simulacro", text: "¿Se hizo un simulacro de entrega —aunque sea de un área— y quedó minuta de lo que se cayó?" },
    { id: "e10", gate: "T3", law: "Ley 213 arts. 17-18", text: "¿Existe un índice del expediente de entrega-recepción, no solo una caja de papeles?" },
    { id: "e11", gate: "T3", law: "Semáforo · críticos", text: "¿Los hallazgos críticos tienen plan escrito con responsable y plazo?" },
    { id: "e12", gate: "T0", law: "Ley 213 · acta", text: "¿El acta está firmada o hay fecha de firma acordada por el Comité?" },
    { id: "e13", gate: "T0", law: "Ley 213 · reservas", text: "¿Las reservas —si las hay— van o irán por escrito, no solo “de palabra”?" },
    { id: "e14", gate: "T0", law: "Custodia", text: "¿Se documentó o está lista la transferencia de archivos, sistemas, sellos y claves?" },
    { id: "e15", gate: "T30", law: "Ley 213 art. 23", text: "¿Está abierta, documentada o ya cerrada la ventana de 30 días hábiles de aclaraciones?" }
  ],
  fronts: [
    { id: "m1", name: "Gobierno y normativa", q: ["¿Hay acuerdos de Cabildo y dueño del cierre?", "¿R086 (revalidar norma/fecha) está hecho o calendarizado?"] },
    { id: "m2", name: "Tesorería y deuda", q: ["¿Estados y deuda tienen expediente del periodo?", "¿Bancos cuadran con libros del último mes cerrado?"] },
    { id: "m3", name: "Ingresos y catastro", q: ["¿Padrones y cartera están entregables?", "¿Se puede reconstruir lo cobrado el último trimestre?"] },
    { id: "m4", name: "RH y nómina", q: ["¿Expedientes de personal están localizables?", "¿Plantilla y última nómina cuadran?"] },
    { id: "m5", name: "Patrimonio", q: ["¿Inventario de muebles e inmuebles existe?", "¿Resguardos tienen nombre vigente?"] },
    { id: "m6", name: "Obra", q: ["¿Contratos vivos tienen bitácora?", "¿Las concluidas tienen acta de recepción?"] },
    { id: "m7", name: "Contratos y adquisiciones", q: ["¿Expediente de cada contrato vivo está armado?", "¿Fianzas y vigencias están localizadas?"] },
    { id: "m8", name: "Archivo, TI y transparencia", q: ["¿Se sabe quién tiene las claves y el archivo de trámite?", "¿Hay inventario de sistemas y respaldos?"] },
    { id: "m9", name: "Jurídico", q: ["¿Hay relación de juicios y términos?", "¿Se marcaron los que vencen en 90 días?"] },
    { id: "m10", name: "Servicios públicos", q: ["¿Está escrito cómo opera el servicio el lunes siguiente?", "¿Contratos de recolección, alumbrado o agua tienen vigencia clara?"] },
    { id: "m11", name: "Fondos federales", q: ["¿FAISMUN tiene expediente propio?", "¿FORTAMUN tiene expediente propio, no mezclado?"] },
    { id: "m12", name: "Paramunicipales", q: ["¿Hay inventario de organismos y fideicomisos?", "¿Cada ente tiene paquete o plan de paquete?"] }
  ],
  verdicts: {
    PRE: { hito: "Antes de T-12", title: "Aún no hay gobierno del cierre", desc: "Se entra por T-12. No se finge antigüedad. Lo primero es nombrar dueños y abrir R086." },
    T12: { hito: "T-12 · Gobierno del cierre", title: "Hay arranque, no hay cierre gobernado", desc: "Falta consolidar dueños, paramunicipales o la revalidación de la fecha. El resto del reloj espera." },
    T6: { hito: "T-6 · Conciliación", title: "El gobierno existe; las cifras no cierran", desc: "Prioridad: bancos, fondos por separado, obra y nómina. Sin eso el acta es narrativa." },
    T3: { hito: "T-3 · Simulacro", title: "Hay números; no hay ensayo de entrega", desc: "Armar índice, probar una entrega y poner plan a cada crítico. No improvisar la última semana." },
    T0: { hito: "T0 · Acta", title: "El paquete se acerca; la firma no está cerrada", desc: "Reservas por escrito y custodia transferida. Firmar no extingue responsabilidades (art. 30)." },
    T30: { hito: "T+30 · Aclaraciones", title: "El acta no cierra el expediente", desc: "Documentar la ventana del artículo 23. Lo no aclarado se canaliza; no se “arregla” el pasado." },
    POST: { hito: "Aclaraciones cubiertas", title: "El reloj formal está cubierto en esta encuesta", desc: "Esto no es dictamen de la ASE ni del OIC. Sigue valiendo la matriz C2 para cada control." }
  }
};
