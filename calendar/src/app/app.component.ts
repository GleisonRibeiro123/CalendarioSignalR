import { HttpClient } from '@angular/common/http';
import { Tarefa } from './models/Tarefa';
import { TarefaService } from './services/tarefa.service';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ɵConsole
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  subWeeks,
  startOfMonth,
  addWeeks
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarUtils
} from 'angular-calendar';
import { forEach } from '@angular/router/src/utils/collection';
import { core, IfStmt } from '@angular/compiler';
import { Usuario } from './models/Usuario';
import {
  HubConnection, HubConnectionBuilder, HttpTransportType
} from '@aspnet/signalr';
import { timeout, timeInterval } from 'rxjs/operators';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';
export class MyCalendarUtils extends CalendarUtils {
  getMonthView(args: GetMonthViewArgs): MonthView {
    args.viewStart = subWeeks(startOfMonth(args.viewDate), 0.5);
    args.viewEnd = addWeeks(endOfMonth(args.viewDate), 0.5);
    return super.getMonthView(args);
  }
}
const colors: any = {
  red: {
    primary: 'red',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: 'green',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: 'blue',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  providers: [
    {
      provide: CalendarUtils,
      useClass: MyCalendarUtils
    }
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  [x: string]: any;

  constructor(private modal: NgbModal, private tarefaService: TarefaService) { }

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  private hubConnection: HubConnection;
  tarefas: Tarefa[];
  tarefasTodo: Tarefa[];
  tarefasInPro: Tarefa[];
  tarefasDone: Tarefa[];
  usuarios: Usuario[];
  // tem que inicializar ele, só verifica se é Todos ou todos. Pera
  // O problema é que não está alterando o valor, assim que envio o select
  valorUsuario: any = 'todos';

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  // tslint:disable-next-line: member-ordering
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: (): void => {
        console.log('Clicou');
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  ngOnInit() {
    this.hubConnection = new HubConnectionBuilder().withUrl('http://192.168.1.127:6001/kanban', {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }).build();
    this.hubConnection
      .start()
      .then(() => this.hubConnection.invoke('getCalendar'))
      .catch(err => console.log('Erro ao estabilizar conexão: '));
    this.hubConnection.on('EnviarCalendar', (tarefa) => {
      this.carregar(tarefa);


    });

    this.hubConnection.on('EnviarTodos', (tarefa) => {
      if (this.valorUsuario == 'todos') {
        this.carregar(tarefa);
      }

    });

    this.hubConnection.on('EnviarUpdate', (tarefa) => {

      if (this.valorUsuario != 'todos') {
        this.carregar(tarefa);
      }

    });

    this.hubConnection.on('EnviarUsuario', (usuario) => { this.usuarios = usuario, this.refresh.next(); });

  }
  carregar(tarefa) {
    this.events = [];
    this.tarefasTodo = tarefa.todo;
    this.tarefasInPro = tarefa.inpro;
    this.tarefasDone = tarefa.done;
    this.events = [];
    this.refresh.next();
    this.tarefasTodo.forEach((element: any) => {
      this.carregarEvent(element);
    });
    this.tarefasInPro.forEach((element: any) => {
      this.carregarEvent(element);
    });
    this.tarefasDone.forEach((element: any) => {
      this.carregarEvent(element);
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  public sendMessage(): void {
    this.hubConnection
      .invoke('sendToAll', this.type, this.obj)
      .catch(err => console.error(err));
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();


    this.hubConnection.invoke('UpdateCalendar', event.id, event.start, event.end);


    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };

  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getUsuario() {
    this.hubConnection.on("Enviar", (usuario) => {
      this.usuarios = usuario;

    });
  }

  getTarefasUsuario(nome: string) {
    this.events = [];
    if (nome.toLocaleLowerCase() === 'todos') {
      this.hubConnection.invoke('getCalendar');
      this.hubConnection.on('EnviarCalendar', (tarefa) => {
        console.log(tarefa);
        this.carrgar(tarefa);
      });
    } else {
      this.hubConnection.invoke('FiltrarUsuarioCalendar', nome);
      this.hubConnection.on('EnviarCalendar', (tarefa) => {
        this.carregar(tarefa);
      });
    }
  }

  carregarEvent(element) {

    let mycolors = [colors.red, colors.yellow, colors.blue];
    let myprioridades2 = ['Baixa', 'Média', 'Alta'];

    let mycolor = mycolors[element.status];
    let myprioridade2: string;
    myprioridade2 = myprioridades2[element.prioridade];

    this.events = [
      ...this.events,
      {
        id: element.id,
        title: element.titulo,
        start: new Date(element.dataRealInicio),
        end: new Date(element.dataRealTermino),
        draggable: true,
        actions: this.actions,
        color: mycolor,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        dataRealInicio: element.dataPrevInicio,
        dataRealTermino: element.dataPrevTermino,
        tempoEsforcoPrevisto: element.tempoEsforcoPrevisto,
        tempoEsforcoReal: element.tempoEsforcoReal,
        status: element.status,
        prioridade: element.prioridade,
        responsavel: element.responsavel,
        usuarioId: element.usuarioId,
        prioridadeVisivel: myprioridade2
      }];
  }
}
