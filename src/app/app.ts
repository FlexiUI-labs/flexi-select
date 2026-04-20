import { Component, computed, signal } from '@angular/core';

import { FlexiSelectModule } from '../../library/src/lib/flexi-select.module'
import { httpResource } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FlexiSelectModule, FormsModule],
  template: `
    <div style="width: 400px; margin:30px">
      <h1>Name is {{name()}}</h1>
      <form #myForm="ngForm" (ngSubmit)="send(myForm)">
      <flexi-select
      [data]="data()"
      [required]="true"
      [showValidationErrors]="true"
      [(ngModel)]="name"
      name="test"
      label="name"
      value="name"
      fontSize="14px"
      [loading]="false"
      language="tr"
      />
      <button style="margin-top: 20px;">Submit</button>
      </form>
    </div>
  `
})
export class App {
  readonly result = httpResource<any[]>(() => "https://jsonplaceholder.typicode.com/users");

  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());
  readonly name = signal<string>("");
  readonly city = signal<string>("");

  send(form:NgForm){
    this.result.reload();
  }
}
