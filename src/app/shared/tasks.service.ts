import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import * as moment from "moment";

export interface Task {
  id?: string;
  title: string;
  date?: string;
}

interface CreateResponse {
  name: string,
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  static url = 'https://ng-practice-calendar-94d26-default-rtdb.firebaseio.com/tasks';

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return []
        }
        return Object.keys(tasks).map(key =>
          // @ts-ignore
          ({...tasks[key], id: key})
        )
      }))
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map(res => ({...task, id: res.name}))
      )
  }
}