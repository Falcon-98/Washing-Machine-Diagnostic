/*
 * data.js — the fault-code reference used by the app.
 *
 * -----------------------------------------------------------------------
 * EDITING THIS FILE
 * -----------------------------------------------------------------------
 * Every entry follows the same shape. Add, change or delete freely — the UI
 * builds itself from this array, so nothing else needs touching.
 *
 *   code     unique identifier shown on the button
 *   cat      one of the CATEGORY ids below (drives the filter chips)
 *   load     "any" | "top" | "front"  — which drum type the code applies to
 *   en / si  one-line cause, English and Sinhala
 *   checks   array of things to inspect, in each language
 *   sol      the usual fix, in each language
 *
 * ⚠ "load" is currently "any" for almost everything, because the original
 *   dashboard did not record model applicability. Set it properly per code
 *   from the service manuals — until you do, the model filter will show every
 *   code for every model.
 *
 * ⚠ Verify every meaning against the manufacturer's service manual. The same
 *   code can mean different things on different control boards.
 */

const CATEGORIES = [
  { id: 'all',         en: 'All',         si: 'සියල්ල',        icon: '▦' },
  { id: 'water',       en: 'Water in',    si: 'ජලය පිරීම',     icon: '💧' },
  { id: 'drain',       en: 'Drain',       si: 'ජලය බැසීම',     icon: '🚰' },
  { id: 'door',        en: 'Door / Lid',  si: 'දොර',           icon: '🚪' },
  { id: 'motor',       en: 'Motor',       si: 'මෝටරය',         icon: '⚙️' },
  { id: 'heating',     en: 'Heating',     si: 'රත් කිරීම',      icon: '🔥' },
  { id: 'sensor',      en: 'Sensors',     si: 'සංවේදක',        icon: '📟' },
  { id: 'balance',     en: 'Balance',     si: 'සමබරතාව',       icon: '🌀' },
  { id: 'electrical',  en: 'Electrical',  si: 'විදුලිය',        icon: '⚡' },
  { id: 'board',       en: 'PCB / Board', si: 'පාලක පුවරුව',   icon: '🧠' }
];

const MODELS = [
  { group: 'Top Loading Models', load: 'top', items: [
    'SWM FA80', 'SWM FAR75 GT WR', 'SWMFAR75 PTWR', 'SWM FAR75 GT',
    'SWM FAR75 PT', 'SWM SAR6', 'SWM SAR65', 'SWM SL 68',
    'SWM MET 80 GL', 'SWM MET 80PL', 'SWM FAR 70 R'
  ]},
  { group: 'Front Loading Models', load: 'front', items: [
    'SWM FL70 (7Kg Front Load)', 'SWM FL80 (8Kg Front Load)',
    'SWM FL100 (10Kg Inverter Front Load)', 'SWM Series Inverter Front Load'
  ]}
];

const ERROR_CODES = [
  { code: 'E1', cat: 'water', load: 'any',
    en: 'Water inlet timeout',
    si: 'ජල සැපයුම් දෝෂය (වතුර පිරවීම ප්‍රමාදයි / ජලය නොපැමිණේ)',
    checks_en: ['Water Tap Pressure', 'Inlet Valve Mesh Filter'],
    checks_si: ['ජල කරාමයේ පීඩනය', 'Inlet Valve Filter එකේ කුණු ඇත්දැයි බලන්න'],
    sol_en: 'Clean inlet filter mesh, open tap fully.',
    sol_si: 'Inlet Filter එක පිරිසිදු කරන්න, ජල කරාමය විවෘත කරන්න.' },

  { code: 'E2', cat: 'door', load: 'any',
    en: 'Door / Lid switch error',
    si: 'දොර වැසී නොමැත / Lid Safety Switch දෝෂය',
    checks_en: ['Lid switch contacts', 'Wiring harness'],
    checks_si: ['Lid switch එක පරීක්ෂා කරන්න', 'PCB වයරින් බලන්න'],
    sol_en: 'Close lid tightly, clean contact points.',
    sol_si: 'දොර තදින් වසන්න, Contact points සුද්ධ කරන්න.' },

  { code: 'E3', cat: 'drain', load: 'any',
    en: 'Water Drain Fault',
    si: 'ජලය බැස යාමේ දෝෂය (Drain Timeout)',
    checks_en: ['Drain Pump', 'Drain Filter blockage'],
    checks_si: ['Drain Pump එක පරීක්ෂා කරන්න', 'Drain Filter එකේ කුණු බලන්න'],
    sol_en: 'Unblock drain filter/hose.',
    sol_si: 'Drain filter එක සහ බටය සුද්ධ කරන්න.' },

  { code: 'E4', cat: 'balance', load: 'any',
    en: 'Spin Unbalance Fault',
    si: 'සමබරතාව ගිලිහී යාම (Unbalance Fault)',
    checks_en: ['Clothes distribution', 'Machine Leveling'],
    checks_si: ['රෙදි එක පැත්තකට බර වී ඇත්දැයි බලන්න', 'Machine එක Levelද බලන්න'],
    sol_en: 'Rearrange clothes evenly.',
    sol_si: 'රෙදි නැවත සමබරව තබන්න.' },

  { code: 'E5', cat: 'sensor', load: 'any',
    en: 'Water Level Sensor Fault',
    si: 'වතුර මට්ටම මනින Sensor දෝෂය',
    checks_en: ['Pressure Switch Connector', 'Air Tube leak'],
    checks_si: ['Pressure Switch Connector එක', 'Air Hose එක බලන්න'],
    sol_en: 'Reconnect air tube tightly or replace pressure switch.',
    sol_si: 'Air tube එක තදින් සවිකරන්න නැතහොත් Sensor එක මාරු කරන්න.' },

  { code: 'E6', cat: 'water', load: 'any',
    en: 'Water Overfill Error',
    si: 'වතුර අධික ලෙස පිරී ඉතිරී යාම',
    checks_en: ['Inlet Valve stuck open', 'Pressure Switch'],
    checks_si: ['Inlet Valve ඇරී තදවී ඇත්දැයි බලන්න', 'Pressure switch එක'],
    sol_en: 'Replace Water Inlet Valve or Pressure Switch.',
    sol_si: 'Inlet Valve එක හෝ Pressure Switch එක මාරු කරන්න.' },

  { code: 'E7', cat: 'motor', load: 'any',
    en: 'Motor Drive / Speed Sensor Fault',
    si: 'මෝටරයේ හෝ Speed Sensor එකෙහි දෝෂය',
    checks_en: ['Motor Harness', 'Motor Capacitor'],
    checks_si: ['Motor Socket සහ වයරින්', 'Capacitor එක බලන්න'],
    sol_en: 'Check motor belt or replace motor unit.',
    sol_si: 'Motor Belt එක පරීක්ෂා කරන්න හෝ මෝටරය මාරු කරන්න.' },

  { code: 'E8', cat: 'electrical', load: 'any',
    en: 'Voltage Fluctuating Fault',
    si: 'විදුලි බලයේ අධික වෙනස්වීම් දෝෂය',
    checks_en: ['Main Line Voltage (220-240V)'],
    checks_si: ['ප්‍රධාන විදුලි සැපයුමේ Voltage එක බලන්න'],
    sol_en: 'Wait until main supply voltage stabilizes.',
    sol_si: 'විදුලි සැපයුම සාමාන්‍ය තත්ත්වයට පත්වන තෙක් සිටින්න.' },

  { code: 'UN', cat: 'balance', load: 'any',
    en: 'Unbalance load',
    si: 'Spin වීමේදී රෙදි නොගැලපෙන ලෙස පිහිටීම',
    checks_en: ['Laundry load distribution'],
    checks_si: ['රෙදි එක ගොඩට තිබේදැයි බලන්න'],
    sol_en: 'Open lid and balance laundry.',
    sol_si: 'දොර ඇර රෙදි පතුරුවා තබන්න.' },

  { code: 'F1', cat: 'sensor', load: 'any',
    en: 'Water Level Sensor Circuit Fault',
    si: 'Water Level Sensor වයරින් විසන්ධි වීම',
    checks_en: ['Sensor wiring connection'],
    checks_si: ['Sensor වයර් කැඩී ඇත්දැයි බලන්න'],
    sol_en: 'Repair wiring or replace sensor.',
    sol_si: 'වයරින් සකස් කරන්න හෝ Sensor එක මාරු කරන්න.' },

  { code: 'F2', cat: 'motor', load: 'any',
    en: 'Motor Overcurrent Protection',
    si: 'මෝටරයට අධික විදුලි ධාරාවක් යාම',
    checks_en: ['Motor rotor movement'],
    checks_si: ['මෝටරය හිරවී ඇත්දැයි බලන්න'],
    sol_en: 'Clear drum blockage.',
    sol_si: 'Drum එකේ හිරවූ දේ ඉවත් කරන්න.' },

  { code: 'F8', cat: 'sensor', load: 'any',
    en: 'Water Level Sensor Frequency Error',
    si: 'Water Level Sensor සංඛ්‍යාත දෝෂය',
    checks_en: ['Pressure sensor frequency'],
    checks_si: ['Pressure sensor සම්බන්ධතාව බලන්න'],
    sol_en: 'Replace water level sensor.',
    sol_si: 'Sensor එක මාරු කරන්න.' },

  { code: 'EC6', cat: 'heating', load: 'any',
    en: 'Heating / Inverter Fault',
    si: 'Heater එකෙහි හෝ Inverter Board දෝෂය',
    checks_en: ['Heater element resistance', 'Inverter module'],
    checks_si: ['Heater element එක පරීක්ෂා කරන්න', 'Inverter board එක බලන්න'],
    sol_en: 'Replace heater or PCB if damaged.',
    sol_si: 'Heater එක හෝ PCB එක මාරු කරන්න.' },

  { code: 'E10', cat: 'water', load: 'any',
    en: 'Water injecting problem',
    si: 'වොෂ් සයිකල් එක අතරතුර වතුර පිරීමේ දෝෂය',
    checks_en: ['Water supply pressure', 'Inlet valve filter'],
    checks_si: ['ජල පීඩනය බලන්න', 'Inlet Valve filter එක බලන්න'],
    sol_en: 'Clean inlet filter mesh.',
    sol_si: 'Inlet Valve Filter එක පිරිසිදු කරන්න.' },

  { code: 'E12', cat: 'water', load: 'any',
    en: 'Water overflow error',
    si: 'ජලය අධික ලෙස පිරී ඉතිරී යාම',
    checks_en: ['Inlet valve solenoid', 'Pressure switch'],
    checks_si: ['Inlet Valve එක බලන්න', 'Pressure switch එක බලන්න'],
    sol_en: 'Restart appliance, check inlet valve.',
    sol_si: 'Restart කර Inlet valve එක පරීක්ෂා කරන්න.' },

  { code: 'E21', cat: 'drain', load: 'any',
    en: 'Overtime water draining',
    si: 'වතුර බැස යාමට අධික වේලාවක් ගතවීම',
    checks_en: ['Drain hose blockage', 'Drain pump filter'],
    checks_si: ['Drain බටයේ ඇහිරීම් බලන්න', 'Drain filter එක බලන්න'],
    sol_en: 'Clean front drain filter.',
    sol_si: 'ඉදිරිපස Filter එක පිරිසිදු කරන්න.' },

  { code: 'E30', cat: 'door', load: 'any',
    en: 'Door not closed properly',
    si: 'දොර නිවැරදිව වැසී නොමැත',
    checks_en: ['Door latch', 'Door switch connection'],
    checks_si: ['දොරේ Hook එක බලන්න', 'Door lock wiring බලන්න'],
    sol_en: 'Close the door properly and restart.',
    sol_si: 'දොර නැවත තදින් වසා ආරම්භ කරන්න.' },

  { code: 'E64', cat: 'heating', load: 'any',
    en: 'Heating element / Drive fault',
    si: 'Heater එකෙහි හෝ Drive Module දෝෂය',
    checks_en: ['Heater element', 'Thermistor wiring'],
    checks_si: ['Heater එක සහ Thermistor වයරින් බලන්න'],
    sol_en: 'Check heater resistance and wiring.',
    sol_si: 'Heater එක සහ වයරින් පරීක්ෂා කරන්න.' },

  { code: 'EXX', cat: 'board', load: 'any',
    en: 'System / PCB fault',
    si: 'පද්ධතිමය හෝ PCB පුවරුවේ දෝෂයක්',
    checks_en: ['Main PCB controller'],
    checks_si: ['Main PCB එක පරීක්ෂා කරන්න'],
    sol_en: 'Restart appliance.',
    sol_si: 'යන්ත්‍රය Restart කරන්න.' },

  { code: 'E20', cat: 'drain', load: 'front',
    en: 'Front Load Drain Error',
    si: 'ජලය බැස නොයාමේ දෝෂය',
    checks_en: ['Coin Trap Filter'],
    checks_si: ['Pump filter එක බලන්න'],
    sol_en: 'Clear drain filter.',
    sol_si: 'Drain filter එක සුද්ධ කරන්න.' },

  { code: 'E40', cat: 'door', load: 'any',
    en: 'Door Lock Interlock Fault',
    si: 'දොර ලොක් නොවීමේ දෝෂය',
    checks_en: ['Door switch resistance'],
    checks_si: ['Door Lock switch එක බලන්න'],
    sol_en: 'Replace door interlock switch.',
    sol_si: 'Door lock Switch එක මාරු කරන්න.' },

  { code: 'OE', cat: 'water', load: 'any',
    en: 'Overflow Error',
    si: 'වතුර ඉතිරී යාම',
    checks_en: ['Inlet Valve', 'Pressure Switch'],
    checks_si: ['Inlet valve එක බලන්න'],
    sol_en: 'Check inlet valve.',
    sol_si: 'Inlet valve එක පරීක්ෂා කරන්න.' },

  { code: 'UE', cat: 'balance', load: 'any',
    en: 'Unbalanced Load Fault',
    si: 'රෙදි අසමබර වීම',
    checks_en: ['Laundry balance'],
    checks_si: ['රෙදි සමබර කරන්න'],
    sol_en: 'Balance clothes.',
    sol_si: 'රෙදි නැවත පතුරුවන්න.' },

  { code: 'E33', cat: 'sensor', load: 'any',
    en: 'Water Pressure Sensor Fault',
    si: 'Water Level / Pressure Sensor දෝෂය',
    checks_en: ['Pressure Sensor wiring', 'Air Hose blockage'],
    checks_si: ['Pressure Sensor වයරින්', 'Air Hose බටයේ ඇහිරීම් බලන්න'],
    sol_en: 'Clean air hose or replace sensor.',
    sol_si: 'Air hose බටය පිරිසිදු කරන්න නැතහොත් Sensor එක මාරු කරන්න.' },

  { code: 'E34', cat: 'sensor', load: 'any',
    en: 'Temperature Sensor / NTC Fault',
    si: 'උෂ්ණත්ව සංවේදකයේ (NTC Sensor) දෝෂය',
    checks_en: ['NTC Sensor Resistance'],
    checks_si: ['NTC Sensor එකේ resistance එක බලන්න'],
    sol_en: 'Replace NTC Temperature Sensor.',
    sol_si: 'NTC Sensor එක මාරු කරන්න.' },

  { code: 'E35', cat: 'water', load: 'any',
    en: 'High Water Level Fault',
    si: 'වතුර අධික ලෙස පිරී යාමේ දෝෂය',
    checks_en: ['Inlet Valve stuck'],
    checks_si: ['Inlet valve ඇරී තදවී ඇත්දැයි බලන්න'],
    sol_en: 'Drain water and replace Inlet Valve.',
    sol_si: 'වතුර ඉවත් කර Inlet Valve එක මාරු කරන්න.' },

  { code: 'E50', cat: 'motor', load: 'any',
    en: 'Motor Overheating Fault',
    si: 'මෝටරය අධික ලෙස රත් වීම',
    checks_en: ['Motor load', 'Drum movement'],
    checks_si: ['මෝටරයේ රත්වීම', 'Drum එක හිරවී ඇත්දැයි බලන්න'],
    sol_en: 'Allow motor to cool down.',
    sol_si: 'මෝටරය නිවෙන තෙක් තබන්න.' },

  { code: 'E60', cat: 'heating', load: 'any',
    en: 'Heating Circuit Fault',
    si: 'Heater පරිපථයේ දෝෂය',
    checks_en: ['Heater Resistance', 'PCB Relay'],
    checks_si: ['Heater Element එකේ Ohms අගය', 'PCB Relay එක බලන්න'],
    sol_en: 'Replace heating element.',
    sol_si: 'Heater element එක මාරු කරන්න.' },

  { code: 'E90', cat: 'board', load: 'any',
    en: 'Main PCB Communication Fault',
    si: 'PCB සහ Display Board අතර සන්නිවේදන දෝෂය',
    checks_en: ['Display Board Wiring Harness'],
    checks_si: ['Display එක සහ PCB එක අතර Cable එක බලන්න'],
    sol_en: 'Re-seat wiring connectors or replace PCB.',
    sol_si: 'Connectors සුද්ධ කර තදින් සවිකරන්න.' },

  { code: 'FC', cat: 'board', load: 'any',
    en: 'Control Board Hardware Fault',
    si: 'ප්‍රධාන පාලන පුවරුවේ (PCB) හාඩ්වෙයාර් දෝෂය',
    checks_en: ['Power Frequency', 'PCB Logic'],
    checks_si: ['විදුලි සැපයුමේ ස්ථාවර භාවය සහ PCB එක බලන්න'],
    sol_en: 'Power off machine for 10 minutes and restart.',
    sol_si: 'විනාඩි 10ක් Off කර තබා Restart කරන්න.' },

  { code: 'CL', cat: 'board', load: 'any',
    en: 'Child Lock Active',
    si: 'ළමා ආරක්ෂණ පද්ධතිය සක්‍රිය වී ඇත',
    checks_en: ['Child Lock Key combination'],
    checks_si: ['Child Lock button දෙක බලන්න'],
    sol_en: 'Press and hold Child Lock buttons for 3 seconds.',
    sol_si: 'Child Lock බොත්තම් දෙක තත්පර 3ක් ඔබාගෙන සිටින්න.' },

  { code: 'de', cat: 'door', load: 'any',
    en: 'Door Open Error',
    si: 'දොර විවෘතව පැවතීමේ දෝෂය',
    checks_en: ['Door catch / Lid switch'],
    checks_si: ['දොරේ ලොක් එක සහ Lid Switch එක බලන්න'],
    sol_en: 'Close door firmly.',
    sol_si: 'දොර තදින් වසන්න.' },

  { code: 'LE', cat: 'motor', load: 'any',
    en: 'Locked Motor Error',
    si: 'මෝටරය හිරවීම හෝ අධික බරක් යෙදීම',
    checks_en: ['Drum rotation for trapped items'],
    checks_si: ['Drum එකේ අස්සේ දේවල් හිරවී ඇත්දැයි බලන්න'],
    sol_en: 'Remove trapped items from drum.',
    sol_si: 'Drum එකේ හිරවී ඇති දේ ඉවත් කරන්න.' }
];

const COMMON_FAULTS = [
  { en: 'No Power', si: 'විදුලිය නොමැත',
    d_en: 'Check Main Cord, PCB Power supply, Fuse, Door Interlock.',
    d_si: 'Main Cord, PCB විදුලි සැපයුම, Fuse සහ Door Interlock එක බලන්න.' },
  { en: 'No Water Drain', si: 'ජලය බැස නොයයි',
    d_en: 'Check Drain Pump filter, Pump motor, Drain Hose and Coin trap.',
    d_si: 'Drain Pump filter, Pump motor, Drain Hose සහ Coin trap එක බලන්න.' },
  { en: 'Unbalance / Vibration', si: 'සෙලවීම / අසමබරතාව',
    d_en: 'Check machine leveling, Shock absorbers, Transport Bolts removal.',
    d_si: 'Machine එකේ Level එක, Shock absorbers සහ Transport Bolts ඉවත් කර ඇත්දැයි බලන්න.' },
  { en: 'No Heating / Warm Wash', si: 'රත් නොවීම',
    d_en: 'Check Heating Element (Heater), NTC Sensor, PCB Heater Relay.',
    d_si: 'Heating Element, NTC Sensor සහ PCB Heater Relay එක බලන්න.' }
];

const CHECKLIST = [
  { id: 'chk1', en: 'Check line voltage (220V–240V) and socket earthing',
    si: 'විදුලි Voltage එක (220V–240V) සහ Earth එක පරීක්ෂා කරන්න' },
  { id: 'chk2', en: 'Ensure transit / transport bolts are removed (front loaders)',
    si: 'Transport Bolts ඉවත් කර ඇත්දැයි බලන්න (Front Loader)' },
  { id: 'chk3', en: 'Inspect water inlet valve mesh filter and water pressure',
    si: 'Inlet Valve Filter එක සහ ජල පීඩනය පරීක්ෂා කරන්න' },
  { id: 'chk4', en: 'Inspect front drain pump filter / coin trap for blockage',
    si: 'ඉදිරිපස Drain Filter / Coin trap එකේ ඇහිරීම් බලන්න' },
  { id: 'chk5', en: 'Test door lock interlock mechanism and micro-switch resistance',
    si: 'Door Lock Interlock එක සහ Micro-switch resistance එක පරීක්ෂා කරන්න' },
  { id: 'chk6', en: 'Check heating element resistance and NTC sensor continuity',
    si: 'Heater Element resistance එක සහ NTC Sensor continuity එක බලන්න' }
];
