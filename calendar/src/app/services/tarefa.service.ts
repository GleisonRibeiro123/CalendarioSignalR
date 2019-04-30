import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarefa } from '../models/Tarefa';
import { EventColor } from 'calendar-utils';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  baseURL = 'http://localhost:5000/api/values';
  baseURL2 = 'http://localhost:5000/api/usuarios';
constructor(private http: HttpClient) { }

getTarefa(): Observable<Tarefa[]> {

  return this.http.get<Tarefa[]>(this.baseURL);
}
Update(start: Date, end: Date, tarefa: any) {

  tarefa.dataPrevistaInicio = start;
  tarefa.dataPrevistaTermino = end;
  return this.http.put<Tarefa>(`${this.baseURL}/${tarefa.id}`, tarefa);
}

getUsuario(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>('http://192.168.1.127:6001/api/usuarios/');
  console.log('dfgfd');
}

getTarefasByUsuario(nome: string) {
  console.log('nome' + nome);
  return this.http.get('http://192.168.1.127:6001/api/tarefas/' + nome);

}
getTarefasStatus() {
  return this.http.get('http://192.168.1.127:6001/api/tarefas/');
}
}
