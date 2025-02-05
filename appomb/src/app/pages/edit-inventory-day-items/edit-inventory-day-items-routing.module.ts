import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditInventoryDayItemsPage} from './edit-inventory-day-items';

const routes: Routes = [
  {
    path: '',
    component: EditInventoryDayItemsPage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditInventoryDayItemsRoutingModule { }
