import { Component, computed, signal } from '@angular/core';

import { FlexiSelectModule } from '../../library/src/lib/flexi-select.module'
import { httpResource } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FlexiSelectModule, FormsModule],
  template: `
    <div style="width: 400px; margin:30px">
      <form #myForm="ngForm" (ngSubmit)="send(myForm)">
        <!-- <flexi-select
        language="tr"
        [data]="data()"
        [(ngModel)]="city"
        name="city"
        label="fullName"
        [multiple]="false"
        value="id"
        [disabled]="false"
        themeClass="light"
        [required]="true"
        [showValidationErrors]="true"
        [loading]="loading()"
        (selected)="selected($event)"
        /> -->
      <flexi-select 
      [data]="names()"
      (selected)="selected($event)"
      [required]="true"
      [showValidationErrors]="true"
      [(ngModel)]="name"
      name="test"
      fontSize="14px"
      [loading]="false"
      language="tr"
      />
      <button style="margin-top: 20px;">Submit</button>
      </form>
        <!-- <flexi-select
        language="tr"
        [data]="data()"
        label="fullName"
        value="id"
        themeClass="light"
        />
        <flexi-select
        language="tr"
        [data]="data()"
        label="fullName"
        value="id"
        />
        <flexi-select
        language="tr"
        [data]="data()"
        label="fullName"
        value="id"
        /> -->
    </div>
  `
})
export class App {
  readonly result = httpResource<any[]>(() => "/data.json");

  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());

  readonly names = signal<string[]>(["Taner","Tugay","Toprak"]);
  readonly name = signal<string>("");
  readonly city = signal<string>("");

  send(form:NgForm){
    console.log(form);
    console.log("name: " + this.name());
    console.log("city " + this.city());
    
    
    
  }

  selected(data:any){
    console.log(data);
    
  }
}
