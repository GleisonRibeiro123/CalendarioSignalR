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
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { forEach } from '@angular/router/src/utils/collection';
import { core, IfStmt } from '@angular/compiler';
import { Usuario } from './models/Usuario';
import {
  HubConnection, HubConnectionBuilder, HttpTransportType
} from '@aspnet/signalr';
import { timeout } from 'rxjs/operators';


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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  [x: string]: any;

  constructor(private modal: NgbModal, private tarefaService: TarefaService) { }

  ngOnInit() {
    this.hubConnection = new HubConnectionBuilder().withUrl('http://192.168.1.127:6001/kanban', {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }).build();
    this.hubConnection
      .start()
      .then(() => this.hubConnection.invoke('getEnviar'))
      .catch(err => console.log('Erro ao estabilizar conexão: '));
    console.log(this.hubConnection);

    this.hubConnection.on('Enviar', (tarefa) => {
      console.log('Tarefa');
      console.log(tarefa);
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

    });

    // this.getUsuario();
    // this.getAlltarefas();
    // this.addTarefasTodo();
    // this.addTarefasInProgress();
    // this.addTarefasDone();
    // this.getTarefasUsuario('todos');

  }

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  private hubConnection: HubConnection;
  tarefas: Tarefa[];
  tarefasTodo: Tarefa[];
  tarefasInPro: Tarefa[];
  tarefasDone: Tarefa[];
  usuarios: Usuario[];

  valorUsuario: any = -1;

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
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

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
    this.events = [];
    this.hubConnection.invoke('Atualizar', event.id, event.start, event.end);
    this.hubConnection.invoke('Update', event.id, event.start, event.end);
    this.hubConnection.on('EnviarMudanca', (tarefa) => {
    console.log(tarefa);
    this.refresh.next();
    this.events = [];
    this.carregarEvent(tarefa);


  });

    // this.tarefaService.Update(newStart, newEnd, event).subscribe(
    //   () => { this.tarefas; }
    // );

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

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }
  getTarefas() {
    this.tarefas = [];
    this.tarefaService.getTarefa().subscribe(
      (_tarefas: Tarefa[]) => {
        this.tarefas = _tarefas;
        this.addEvent();
      }
    );
  }

  getUsuario() {
    this.tarefaService.getUsuario().subscribe(
      (_usuario: Usuario[]) => {
        this.usuarios = _usuario;
        this.refresh.next();
      }
    );
  }

  getTarefasUsuario(nome: string) {
    this.events = [];
    if (nome.toLocaleLowerCase() === 'todos') {
      this.addTarefasInProgress();
      this.addTarefasDone();
      this.addTarefasTodo();
    } else {
      this.tarefaService.getTarefasByUsuario(nome).subscribe((evento: any) => {

        this.tarefasDone = evento.done;
        this.tarefasInPro = evento.inpro;
        this.tarefasTodo = evento.todo;

        this.tarefasDone.forEach((element: any) => {
          this.carregarEvent(element);
        });
        this.refresh.next();
        this.tarefasTodo.forEach((element: any) => {
          this.carregarEvent(element);
        });
        this.refresh.next();
        this.tarefasInPro.forEach((element: any) => {
          this.carregarEvent(element);
        });
      }
      );

    }
  }
  getAlltarefas() {
    this.tarefaService.getTarefasStatus().subscribe((response: any) => {
      // this.events = [];

      this.tarefasDone = response.done;
      this.tarefasInPro = response.inpro;
      this.tarefasTodo = response.todo;
      this.tarefasDone.forEach((element: any) => {
        this.carregarEvent(element);
      });
      this.refresh.next();
      this.tarefasTodo.forEach((element: any) => {
        this.carregarEvent(element);
      });
      this.refresh.next();
      this.tarefasInPro.forEach((element: any) => {
        this.carregarEvent(element);
      });

    });
  }


  // addTarefasTodo() {
  //   this.tarefaService.getTarefasStatus().subscribe((response: any) => {
  //     this.events = [];
  //     this.tarefasTodo = response.todo;
  //     this.tarefasTodo.forEach(element => {
  //       this.carregarEvent(element);
  //     });
  //   });

  // }
  // addTarefasInProgress() {
  //   this.tarefaService.getTarefasStatus().subscribe((response: any) => {
  //     this.events = [];
  //     this.tarefasInPro = response.inpro;
  //     this.tarefasInPro.forEach(element => {
  //       this.carregarEvent(element);
  //     });
  //   });
  // }

  // addTarefasDone() {
  //   this.tarefaService.getTarefasStatus().subscribe((response: any) => {
  //     this.events = [];
  //     this.tarefasDone = response.done;
  //     this.tarefasDone.forEach(element => {
  //       this.carregarEvent(element);
  //     });

  //   });
  // }

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
        dataRealInicio: element.dataRealInicio,
        dataRealTermino: element.dataRealTermino,
        tempoEsforcoPrevisto: element.tempoEsforcoPrevisto,
        tempoEsforcoReal: element.tempoEsforcoReal,
        status: element.status,
        prioridade: element.prioridade,
        responsavel: element.responsavel,
        usuarioId: element.usuarioId
      }];

  }
  getTarefasStatus() {
    this.tarefaService.getTarefasStatus().subscribe((response: any) => {
      this.tarefasTodo = response.todo;
      this.tarefasInPro = response.inpro;
      this.tarefasDone = response.done;
    }, error => {
      console.log(error);
    });
  }
}
