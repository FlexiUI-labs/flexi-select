import { Component, computed } from '@angular/core';

import { FlexiSelectModule } from '../../library/src/lib/flexi-select.module'
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [FlexiSelectModule],
  template: `
    <div style="width: 200px; margin:30px">
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
        />
    </div>
  `
})
export class App {
  readonly result = httpResource<any[]>(() => "/data.json");

  readonly data = computed(() => this.result.value() ?? []);
}
