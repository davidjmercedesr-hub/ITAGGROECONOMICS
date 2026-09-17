import type {Observation} from './domain';
import type {AIContextPack} from './ai/context-pack';

export type AssistantInput={message:string;observation?:Observation;contextPack?:AIContextPack};

export const localAssistant={
  async ask(input:AssistantInput){
    if(input.contextPack){
      const p=input.contextPack;
      return [
        `Kontext: ${p.field.name}${p.field.crop?' · '+p.field.crop:''}.`,
        p.observation.text?`Beobachtung: ${p.observation.text}.`:'Keine Textbeobachtung vorhanden.',
        p.sensorReadings.length?`Messwerte: ${p.sensorReadings.map(s=>s.key+': '+s.value+' '+s.unit).join(', ')}.`:'',
        p.weatherContext?'Wetterkontext ist vorhanden.':'Noch kein Wetterkontext.',
        p.history.length?`Es liegen ${p.history.length} frühere Beobachtungen für dieses Feld vor.`:'Noch kein Feldverlauf im Kontext.',
        input.message.toLowerCase().includes('aufgabe')?'Nächster Schritt kann als konkrete Aufgabe festgehalten werden.':'Prüfe zuerst Ort, Zeitpunkt, Ausmaß und ob das Muster wiederholt auftritt.',
        'Agronomische Einschätzungen bleiben als Hinweise mit Unsicherheit gekennzeichnet.'
      ].filter(Boolean).join(' ');
    }
    return ['Kontext erkannt.','Prüfe zuerst Ort, Zeitpunkt, betroffene Fläche und ob das Muster wiederholt auftritt.',input.message.toLowerCase().includes('aufgabe')?'Daraus kann eine strukturierte Aufgabe mit Feld und Fälligkeit entstehen.':'Daraus kann eine strukturierte Beobachtung entstehen.','Agronomische Einschätzungen bleiben als Hinweise mit Unsicherheit gekennzeichnet.'].join(' ');
  }
};
