import { EventColor, EventAction } from 'calendar-utils';

export interface Tarefa {
   id : number;
   title: string;
   dataPrevInicio: Date;
   dataPrevTermino: Date;
   dataRealInicio: Date;
   dataRealTermino: Date;
   tempoEsforcoPrevisto: number;
   tempoEsforcoReal: number;
   status: number;
   prioridade: number;
   color: EventColor;

  responsavel: null;
  usuarioId: number;

}
