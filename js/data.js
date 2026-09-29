/* Monitor de Hito ER – CATU */
window.CATU_HITO = {
  contactEmail: "centro.catu@gmail.com",
  formspree: "",
  minExpress: 8,
  minCero: 6,
  gates: [
    { id: "T12", label: "T-12", title: "Gobierno del cierre", hint: "Dueños, R086, paramunicipales." },
    { id: "T6", label: "T-6", title: "Conciliación", hint: "Bancos, fondos, obra, nómina." },
    { id: "T3", label: "T-3", title: "Simulacro", hint: "Índice, ensayo, planes de críticos." },
    { id: "T0", label: "T0", title: "Acta", hint: "Firma, reservas, custodia." },
    { id: "T30", label: "T+30", title: "Aclaraciones", hint: "Art. 23, 30 días hábiles." }
  ],
  cero: [
    { id: "c1", block: "Tesorería", law: "Cierre de cuentas del mes", text: "¿Tesorería tiene conciliación bancaria del último mes cerrado, con estado de cuenta anexo?" },
    { id: "c2", block: "Tesorería", law: "Deuda visible", text: "¿Hay una lista actual de créditos, retenciones o pagos pendientes —aunque no esté de entrega?" },
    { id: "c3", block: "Fondos", law: "FAISMUN", text: "¿FAISMUN tiene su propia carpeta o expediente, no mezclado con otros fondos?" },
    { id: "c4", block: "Fondos", law: "FORTAMUN", text: "¿FORTAMUN tiene su propia carpeta o expediente?" },
    { id: "c5", block: "Personal", law: "Nómina", text: "¿La plantilla y la última nómina pagada cuadran entre sí?" },
    { id: "c6", block: "Obra", law: "Contratos vivos", text: "¿Los contratos de obra que siguen abiertos tienen bitácora o expediente localizable?" },
    { id: "c7", block: "Patrimonio", law: "Bienes", text: "¿Existe un inventario de muebles e inmuebles, aunque no esté al día?" },
    { id: "c8", block: "Archivo", law: "Custodia cotidiana", text: "¿Se sabe quién tiene las claves de sistemas, sellos y el archivo de trámite?" },
    { id: "c9", block: "Jurídico", law: "Términos", text: "¿Hay una lista de juicios, convenios o deudas que no pueden esperar al siguiente Ayuntamiento?" },
    { id: "c10", block: "Calendario", law: "Ley 213 · fecha del acta", text: "¿El Ayuntamiento ya tiene claro en qué mes debe firmarse el acta de entrega-recepción?" }
  ],
  express: [
    { id: "e1", gate: "T12", law: "Ley 213 · gobierno del cierre", text: "¿Hay un dueño nominado del cierre —nombre y cargo—, no solo el Comité en el acta constitutiva?" },
    { id: "e2", gate: "T12", law: "B2 · asignación de frentes", text: "¿Tesorería, obra, RH y jurídico tienen responsable con nombre para el expediente de entrega?" },
    { id: "e3", gate: "T12", law: "R086", text: "¿En los últimos 90 días se revalidó la norma y la hipótesis de fecha T0?" },
    { id: "e4", gate: "T12", law: "B2 · paramunicipales", text: "¿Está el inventario de paramunicipales y cada uno tiene paquete o plan de paquete?" },
    { id: "e5", gate: "T6", law: "LGCG · conciliaciones", text: "¿Hay conciliación bancaria del último mes cerrado, cuenta por cuenta?" },
    { id: "e6", gate: "T6", law: "LCF · FAISMUN / FORTAMUN", text: "¿FAISMUN y FORTAMUN viven en expedientes separados?" },
    { id: "e7", gate: "T6", law: "Obra · actas de recepción", text: "¿Cada contrato de obra vivo tiene bitácora y, si ya concluyó, acta de entrega-recepción?" },
    { id: "e8", gate: "T6", law: "RH · plantilla", text: "¿La plantilla y la última nómina pagada cuadran entre sí?" },
    { id: "e9", gate: "T3", law: "B2 · simulacro", text: "¿Se hizo un simulacro de entrega y quedó minuta de lo que se cayó?" },
    { id: "e10", gate: "T3", law: "Ley 213 arts. 17-18", text: "¿Existe un índice del expediente de entrega-recepción, no solo una caja de papeles?" },
    { id: "e11", gate: "T3", law: "Semáforo · críticos", text: "¿Los hallazgos críticos tienen plan escrito con responsable y plazo?" },
    { id: "e12", gate: "T0", law: "Ley 213 · acta", text: "¿El acta está firmada o hay fecha de firma acordada por el Comité?" },
    { id: "e13", gate: "T0", law: "Ley 213 · reservas", text: "¿Las reservas van o irán por escrito, no solo de palabra?" },
    { id: "e14", gate: "T0", law: "Custodia", text: "¿Se documentó o está lista la transferencia de archivos, sistemas, sellos y claves?" },
    { id: "e15", gate: "T30", law: "Ley 213 art. 23", text: "¿Está abierta, documentada o ya cerrada la ventana de 30 días hábiles de aclaraciones?" }
  ],
  fronts: [
    { id: "m1", name: "Gobierno y normativa", q: ["¿Hay acuerdos de Cabildo y dueño del cierre?", "¿R086 está hecho o calendarizado?"] },
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
    CERO: { hito: "Cierre aún no iniciado", title: "No se evalúa un protocolo que no han puesto en marcha", desc: "Esta foto mira lo que ya debería existir en la administración cotidiana. Con eso se decide por dónde arrancar." },
    PRE: { hito: "Antes de T-12", title: "Aún no hay gobierno del cierre", desc: "Se entra por T-12. No se finge antigüedad. Lo primero es nombrar dueños y abrir R086." },
    T12: { hito: "T-12 · Gobierno del cierre", title: "Hay arranque, no hay cierre gobernado", desc: "Falta consolidar dueños, paramunicipales o la revalidación de la fecha." },
    T6: { hito: "T-6 · Conciliación", title: "El gobierno existe; las cifras no cierran", desc: "Prioridad: bancos, fondos por separado, obra y nómina." },
    T3: { hito: "T-3 · Simulacro", title: "Hay números; no hay ensayo de entrega", desc: "Armar índice, probar una entrega y poner plan a cada crítico." },
    T0: { hito: "T0 · Acta", title: "El paquete se acerca; la firma no está cerrada", desc: "Reservas por escrito y custodia transferida. Firmar no extingue responsabilidades (art. 30)." },
    T30: { hito: "T+30 · Aclaraciones", title: "El acta no cierra el expediente", desc: "Documentar la ventana del artículo 23." },
    POST: { hito: "Aclaraciones cubiertas", title: "El reloj formal está cubierto en esta encuesta", desc: "Esto no es dictamen de la ASE ni del OIC." }
  }
};
