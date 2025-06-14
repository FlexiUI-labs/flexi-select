import { Component, computed } from '@angular/core';

import { FlexiSelectModule } from '../../library/src/lib/flexi-select.module'
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [FlexiSelectModule],
  template: `
    <div style="width: 200px; margin:30px">
        <flexi-select
        [data]="data()"
        label="name"
        value="id"
        />
    </div>
  `
})
export class App {
  readonly result = httpResource<any[]>(() => "https://jsonplaceholder.typicode.com/users");

  readonly data = computed(() => this.result.value() ?? []);
}
