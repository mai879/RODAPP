/* RodApp · datos de ejemplo (rodadas, rutas, grupos, comunidad). Sustituir por Supabase en producción. */
'use strict';


/* ================= datos ================= */
const NIV={Principiante:1,Intermedio:2,Avanzado:3};
const NIVD={Principiante:'Menos de 1 año o rodadas cortas.',Intermedio:'Rodadas de fin de semana con 1 o 2 paradas.',Avanzado:'Ritmo sport y rutas largas de montaña.'};
const CCS=[{k:'<200',t:'Menos de 200 cc',d:'Urbanas, scooters y motos de entrada'},{k:'200–500',t:'200 cc a 500 cc',d:'Naked, trail y deportivas medias'},{k:'>500',t:'Más de 500 cc',d:'Alto cilindraje y touring'}];
const ZONAS=['Norte','Calera','Patios','Sur','Occidente'];
const ZONA_INFO={Norte:'Suba, Usaquén, Chía, Cajicá y Zipaquirá',Calera:'La Calera, Guasca y Guatavita',Patios:'Vía Patios – La Calera',Sur:'Soacha, Sibaté y Fusagasugá',Occidente:'Tenjo, Tabio, Mosquera y Madrid'};
const FECHAS=['Sáb 14 nov','Dom 15 nov','Sáb 21 nov','Dom 22 nov'];
const HORAS=['5:30 AM','6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM'];
const DISP=['Entre semana, de noche','Sábados','Domingos','Festivos','Madrugadas'];
const TIPOS=['Scooter','Naked','Deportiva','Trail','Touring','Custom'];
const MARCAS=['AKT','Auteco','Bajaj','BMW','Honda','Kawasaki','KTM','Royal Enfield','Suzuki','Yamaha','Otra'];
const SPOTS=['Portal del Norte · Autopista Norte','Peaje Patios · Vía a La Calera','Portal 80 · Av. Calle 80','Portal Sur · Autopista Sur','Parque El Tunal · Sur de Bogotá','Portal de las Américas · Av. Américas','Estación de servicio Cra 15 #93-47'];
const RTS=[
 [[34,168],[62,138],[98,128],[130,96],[172,76],[214,50],[266,30]],
 [[40,40],[78,66],[118,60],[150,98],[192,116],[238,150],[268,172]],
 [[30,112],[72,98],[112,138],[162,152],[206,124],[252,86]]
];
/* Rutas sugeridas desde Bogotá. km = ida y vuelta aproximada (dato de ejemplo, validar con trazado real). p = índice de SPOTS. */
const RUTAS=[
 {n:'La Calera – Guasca',km:52,z:'Calera',p:1},
 {n:'Suba – Zipaquirá',km:48,z:'Norte',p:0},
 {n:'Autopista Sur – Sibaté',km:64,z:'Sur',p:3},
 {n:'Patios – La Calera',km:41,z:'Patios',p:1},
 {n:'Chía – Cajicá',km:36,z:'Norte',p:0},
 {n:'Sesquilé – Guatavita',km:96,z:'Norte',p:0},
 {n:'Tenjo – Tabio',km:68,z:'Occidente',p:2},
 {n:'Mosquera – Madrid',km:44,z:'Occidente',p:5}
];
const RNAMES=RUTAS.map(r=>r.n);
const RKM=RUTAS.map(r=>r.km);
const POOL=['Andrés F.','Laura G.','Diego A.','Valentina S.','Nicolás B.','Sofía M.'];
const TINTS=[['#D3F3E3','#064D2D'],['#DCE8FF','#123A7A'],['#FFE7C2','#6B3D00'],['#FFD9D5','#7A1D14'],['#E6DDFB','#3E2A7A'],['#E4EEF0','#1E4750']];
const ALERTS={
  peligro:{t:'Peligro / Caída',say:'Peligro adelante',k:'#FF3B30',kt:'#fff',ic:'warn'},
  parada:{t:'Parada técnica',say:'Parada técnica',k:'#FF9500',kt:'#1A0F00',ic:'wrench'},
  gasolina:{t:'Gasolina / Descanso',say:'Paramos a tanquear o descansar',k:'#007AFF',kt:'#fff',ic:'fuel'}
};
function seed(){return [
 {id:1,name:'La Calera – Guasca',zona:'Calera',cc:'200–500',nivel:'Intermedio',fecha:'Dom 15 nov',hora:'7:00 AM',cupo:8,part:['Mauricio T.','Sofía M.','Julián P.','Andrés F.','Laura G.'],punto:SPOTS[1],km:52,rt:0,host:'Mauricio T.',club:'Calera Riders',ver:true},
 {id:2,name:'Suba – Zipaquirá',zona:'Norte',cc:'<200',nivel:'Principiante',fecha:'Dom 15 nov',hora:'8:30 AM',cupo:6,part:['Paola R.','Esteban L.','Marcela D.','Hugo V.','Tatiana C.'],punto:SPOTS[0],km:48,rt:1,host:'Paola R.',club:'Parche Norte MC',ver:true},
 {id:3,name:'Autopista Sur – Sibaté',zona:'Sur',cc:'>500',nivel:'Avanzado',fecha:'Dom 15 nov',hora:'6:00 AM',cupo:10,part:['Iván G.','Wilson P.','Diego A.'],punto:SPOTS[3],km:64,rt:2,host:'Iván G.',club:'Sur Sport Bogotá',ver:true},
 {id:4,name:'Patios – La Calera',zona:'Patios',cc:'200–500',nivel:'Intermedio',fecha:'Sáb 21 nov',hora:'6:30 AM',cupo:8,part:['Santiago N.','Lorena Q.','Mateo Z.','Pilar J.'],punto:SPOTS[1],km:41,rt:3,host:'Santiago N.',club:'Patios Trail Club',ver:true},
 {id:5,name:'Chía – Cajicá',zona:'Norte',cc:'<200',nivel:'Principiante',fecha:'Sáb 14 nov',hora:'7:30 AM',cupo:10,part:['Carlos B.','Dani S.','Lucho M.','Ángela P.','Jorge R.','Mónica T.','Felipe A.','Natalia O.'],punto:SPOTS[0],km:36,rt:4,host:'Carlos B.',club:'Moteros del Norte',ver:false,lugar:'chia'},
 {id:6,name:'Sesquilé – Guatavita',zona:'Norte',cc:'>500',nivel:'Avanzado',fecha:'Sáb 21 nov',hora:'6:30 AM',cupo:8,part:['Yurany H.','Brayan C.','Valentina S.','Nicolás B.'],punto:SPOTS[0],km:96,rt:5,host:'Yurany H.',club:'Sesquilé Riders',ver:true},
 {id:7,name:'Tenjo – Tabio',zona:'Occidente',cc:'200–500',nivel:'Intermedio',fecha:'Dom 22 nov',hora:'7:30 AM',cupo:8,part:['Julián M.','Natalia V.','Óscar P.'],punto:SPOTS[2],km:68,rt:6,host:'Julián M.',club:'Occidente Riders',ver:true},
 {id:8,name:'Mosquera – Madrid',zona:'Occidente',cc:'<200',nivel:'Principiante',fecha:'Sáb 14 nov',hora:'8:00 AM',cupo:8,part:['Daniela K.','Brian S.'],punto:SPOTS[5],km:44,rt:7,host:'Daniela K.',club:'Moteras de la Sabana',ver:true}
];}

/* ================= experiencia, insignias y comunidad ================= */
const LV=[0,100,250,450,700,1000,1400],LVN=['Novato','Rodador','Rutero','Viajero','Veterano','Experto','Leyenda'];
const XP_RODADA=50,XP_INSIGNIA=200;
const BADGES=[
 {k:'bog',n:'Bogotá',km:25,c:'#12B76A',g:'<path d="M3 19l6-9 4 6 3-4 5 7z"/>'},
 {k:'chia',n:'Chía',km:35,c:'#7C5CFF',g:'<path d="M15 4a8 8 0 1 0 5 12A7 7 0 0 1 15 4z"/>'},
 {k:'tun',n:'Tunja',km:120,c:'#64748B',g:'<path d="M5 20V10l7-5 7 5v10zM10 20v-5h4v5"/>'},
 {k:'vvc',n:'Villavicencio',km:110,c:'#D97706',g:'<circle cx="12" cy="13" r="4"/><path d="M3 19h18M12 5v2M5 8l1.5 1.5M19 8l-1.5 1.5"/>'},
 {k:'nva',n:'Neiva',km:280,c:'#0891B2',g:'<path d="M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0"/>'},
 {k:'bga',n:'Bucaramanga',km:350,c:'#4D7C0F',g:'<circle cx="12" cy="9" r="5"/><path d="M12 14v7"/>'},
 {k:'mde',n:'Medellín',km:380,c:'#E11D48',g:'<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="5.5" r="2.5"/><circle cx="12" cy="18.5" r="2.5"/><circle cx="5.5" cy="12" r="2.5"/><circle cx="18.5" cy="12" r="2.5"/>'},
 {k:'clo',n:'Cali',km:420,c:'#2563EB',g:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'}
];
const TEMAS={
 accidente:{l:'Accidente',f:'Accidentes',ic:'warn',c:'#FF3B30',ph:'Qué pasó y dónde. Ej. Caída en la Autopista Sur, carril derecho cerrado.'},
 peligro:{l:'Peligro en la vía',f:'Peligros',ic:'warn',c:'#FF9500',ph:'Dónde está el peligro y cómo evitarlo.'},
 hurto:{l:'Robo o hurto',f:'Hurtos',ic:'lock',c:'#F43F5E',ph:'Qué pasó, dónde y a qué hora. No publiques placas ni datos de personas.'},
 precaucion:{l:'Precaución',f:'Precauciones',ic:'shield',c:'#007AFF',ph:'¿Qué deben tener en cuenta los demás?'},
 normas:{l:'Normas y trámites',f:'Normas',ic:'id',c:'#38BDF8',ph:'Comparte una norma, trámite o control que los demás deban conocer.'},
 taller:{l:'Talleres',f:'Talleres',ic:'wrench',c:'#FACC15',ph:'Pide o recomienda un taller. Cuenta la zona y el servicio.'},
 ruta:{l:'Rutas y paradas',f:'Rutas',ic:'pin',c:'#2DD4BF',ph:'Tu consejo para una ruta o parada: horario, estado de la vía, dónde comer.'},
 rodada:{l:'Rodadas',f:'Rodadas',ic:'route',c:'#C084FC',ph:'Cuenta qué rodada promocionas o a quién buscas para salir.'},
 video:{l:'Video',f:'Videos',ic:'play',c:'#2FD98D',ph:'Cuenta de qué rodada es el video.'}
};
/* Grupos de ejemplo. Categorías inspiradas en los tipos de comunidades motociclistas que hay en Facebook en Bogotá: rodadas por zona, commuters, mujeres moteras y mecánica. Cifras ilustrativas. */
const GRUPOS=[
 {k:'norte',n:'Parche Norte MC',z:'Norte',m:860,d:'Salidas tranquilas desde el Portal del Norte hacia Zipaquirá y Chía.',ver:true},
 {k:'calera',n:'Calera Riders',z:'Calera',m:1240,d:'Rodadas de fin de semana por La Calera, Guasca y Guatavita.',ver:true},
 {k:'sur',n:'Sur Sport Bogotá',z:'Sur',m:540,d:'Alto cilindraje y ritmo sport por la Autopista Sur.',ver:true},
 {k:'patios',n:'Patios Trail Club',z:'Patios',m:410,d:'Trail y rutas de montaña por la vía Patios – La Calera.',ver:true},
 {k:'occ',n:'Occidente Riders',z:'Occidente',m:380,d:'Tenjo, Tabio y la Sabana de Occidente.',ver:true},
 {k:'muj',n:'Moteras de la Sabana',z:'Occidente',m:690,d:'Rodadas de mujeres y aliadas, de nivel principiante a intermedio.',ver:true},
 {k:'urb',n:'Commuters Bogotá',z:'Toda la ciudad',m:2100,d:'Alertas de tráfico, huecos y retenes para quienes usan la moto todos los días.',ver:false},
 {k:'taller',n:'Mecánica y Talleres',z:'Toda la ciudad',m:1530,d:'Recomendaciones de talleres, repuestos y mantenimiento.',ver:false}
];
function comSeed(){return [
 {id:101,n:'Iván G.',zona:'Sur',tema:'accidente',ago:'Hace 12 min',t:'Caída en la Autopista Sur, altura de Terreros. Hay aceite en el carril derecho y la policía está cerrando ese carril. Pasen por el izquierdo y con calma.',likes:23,conf:14,g:'sur',c:[{n:'Wilson P.',t:'Gracias por avisar, voy para allá.'},{n:'Diego A.',t:'Ya vi la fila desde el puente. Tomen la vía alterna.'}]},
 {id:113,n:'Esteban L.',zona:'Norte',tema:'accidente',ago:'Hace 18 min',t:'Choque leve en la Autopista Norte con calle 193, sentido norte. Hay dos carriles ocupados. Vayan despacio y dejen distancia.',likes:5,conf:6,c:[]},
 {id:108,n:'Laura G.',zona:'Occidente',tema:'hurto',ago:'Hace 25 min',t:'Intento de hurto a un motociclista en un semáforo de la Calle 80. Eviten sacar el celular parados y cierren bien la maleta.',likes:27,conf:16,c:[{n:'Hugo V.',t:'Gracias, lo comparto con el parche.'}]},
 {id:102,n:'Paola R.',zona:'Norte',tema:'peligro',ago:'Hace 40 min',t:'Hueco grande en la Autopista Norte, calle 170, sentido sur. De noche casi no se ve. Báyense al carril de la izquierda.',likes:31,conf:19,g:'norte',c:[{n:'Hugo V.',t:'Casi me lo como el viernes. Gracias.'}]},
 {id:103,n:'Mauricio T.',zona:'Calera',tema:'precaucion',ago:'Hace 1 h',t:'Neblina espesa subiendo a La Calera. Luces bajas, más distancia entre motos y frenen suave en las curvas.',likes:18,conf:8,g:'calera',c:[]},
 {id:109,n:'Daniela K.',zona:'Occidente',tema:'normas',ago:'Hace 2 h',t:'Lleven SOAT, licencia y revisión técnico-mecánica a la mano. En los retenes a la salida de la ciudad los piden y evitan un comparendo.',likes:34,c:[{n:'Brian S.',t:'Buen recordatorio. Yo lo guardo en el celular y en papel.'}]},
 {id:104,n:'Sofía M.',zona:'Calera',tema:'video',ago:'Hace 3 h',t:'Así quedó la bajada por Guasca en la rodada del domingo. Gracias al parche por el ritmo.',likes:47,rt:0,dur:'0:48',g:'calera',c:[{n:'Andrés F.',t:'Qué buen recorrido. Para la próxima me apunto.'}]},
 {id:110,n:'Wilson P.',zona:'Sur',tema:'taller',ago:'Hace 4 h',t:'¿Alguien conoce un taller de confianza por el sur para revisar frenos y cambiar el kit de arrastre? Busco buen precio y que entreguen el mismo día.',likes:12,g:'taller',c:[{n:'Iván G.',t:'Pregunta por la garantía por escrito antes de dejar la moto.'}]},
 {id:105,n:'Paola R.',zona:'Norte',tema:'rodada',ago:'Hace 5 h',t:'Busco un parche más para la rodada a Zipaquirá del domingo. Ritmo tranquilo, salida desde el Portal del Norte.',likes:9,ride:2,g:'norte',c:[]},
 {id:111,n:'Julián M.',zona:'Occidente',tema:'ruta',ago:'Hace 6 h',t:'Ruta Tenjo – Tabio: salgan temprano para evitar el tráfico del día y tanqueen en Tenjo. En Tabio hay buenos sitios para desayunar.',likes:21,g:'occ',c:[]},
 {id:114,n:'Marcela D.',zona:'Norte',tema:'rodada',ago:'Hace 7 h',t:'Busco parche para una rodada tranquila a Chía el sábado. Tengo una moto de 125 cc y es mi primera vez en grupo. ¿Alguien me acompaña?',likes:14,ride:5,c:[{n:'Carlos B.',t:'Mira la rodada Chía – Cajicá: es nivel principiante y quedan cupos.'}]},
 {id:106,n:'Santiago N.',zona:'Patios',tema:'peligro',ago:'Ayer',t:'Derrumbe parcial en la vía Patios – La Calera. Hay piedras sueltas en la curva, vayan despacio.',likes:26,conf:11,g:'patios',c:[{n:'Lorena Q.',t:'Confirmo, hoy en la mañana seguía igual.'}]},
 {id:107,n:'Iván G.',zona:'Sur',tema:'rodada',ago:'Ayer',t:'Sur Sport Bogotá abre cupos para la rodada Autopista Sur – Sibaté. Alto cilindraje y ritmo sport. Casco y chaqueta obligatorios.',likes:15,ride:3,g:'sur',c:[]},
 {id:115,n:'Brian S.',zona:'Occidente',tema:'rodada',ago:'Ayer',t:'Rodada Mosquera – Madrid, nivel principiante. Sin picar y con casco certificado. Quedan cupos.',likes:11,ride:8,g:'occ',c:[]}
];}
